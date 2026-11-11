// Acciones que guardan en Firestore todo lo que hace el usuario.
// Cada función lee el documento actual del usuario (colección "realUsers"),
// calcula los cambios y los guarda en una sola escritura.

import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

// Campos para updateDoc (admite rutas con punto como "saverLevel.goalsCompleted")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateData = { [field: string]: any };
import {
    plannedExpenseFirebaseType,
    pointsHistoryFirebaseType,
    realExpenseFirebaseType,
    realIncomeFirebaseType,
    savingFirebaseType,
    streakFirebaseType,
    userDataFromFirebaseType
} from "../../types/firebaseUserTypes";
import { expenseNameCategories } from "../../store/expenses/types";
import { incomeNameCategories, incomeNameEntries } from "../../store/incomes/types";
import { savingEnum } from "../../store/savings/types";
import { DEFAULT_EXCHANGES, DEFAULT_MISSIONS, missionConditions, missionContext } from "../../utils/defaultGameData";
import { getSaverLevelInfo } from "../../utils/saverLevels";

const REAL_USERS = "realUsers";

const userRef = (uid: string) => doc(db, REAL_USERS, uid);

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

export const newId = (): string => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

// Fecha local en formato YYYY-MM-DD (para la racha)
export const dayKey = (date: Date = new Date()): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const readUser = async (uid: string): Promise<userDataFromFirebaseType> => {
    if (!uid) throw { code: "auth/no-current-user" };
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) throw { code: "not-found" };
    return snap.data() as userDataFromFirebaseType;
};

const isSameMonth = (date: Date, ref: Date = new Date()) =>
    date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear();

// Colores de las gráficas
export const EXPENSE_COLORS: Record<string, string> = {
    [expenseNameCategories.hogar]: "#2D18BF",
    [expenseNameCategories.mercado]: "#A8F25D",
    [expenseNameCategories.ropa]: "#F2622E",
    [expenseNameCategories.salidas]: "#CCFC56",
    [expenseNameCategories.viajes]: "#4A00E0",
    [expenseNameCategories.familia]: "#FF9F1C",
    [expenseNameCategories.Amigos]: "#00B4D8",
    [expenseNameCategories.otro]: "#9E9E9E",
};

export const INCOME_COLORS: Record<string, string> = {
    [incomeNameEntries.nu]: "#2D18BF",
    [incomeNameEntries.masterCard]: "#F2622E",
    [incomeNameEntries.visa]: "#4A00E0",
    [incomeNameEntries.efectivo]: "#A8F25D",
    [incomeNameEntries.debito]: "#00B4D8",
    [incomeNameEntries.otro]: "#9E9E9E",
};

// ---------------------------------------------------------------------------
// Puntos, experiencia, nivel y racha (HU40, HU44, HU45, HU46)
// ---------------------------------------------------------------------------

// Lo que gana el usuario por cada acción financiera
export const ACTION_REWARDS = {
    income: { points: 10, exp: 20, reason: "Registered an income" },
    expense: { points: 5, exp: 10, reason: "Registered an expense" },
    plannedExpense: { points: 5, exp: 10, reason: "Planned an expense" },
    createSaving: { points: 20, exp: 40, reason: "Created a savings goal" },
    deposit: { points: 15, exp: 30, reason: "Saved money in a goal" },
    goalCompleted: { points: 100, exp: 150, reason: "Completed a savings goal" },
};

export interface RewardResult {
    points: number,
    exp: number,
    leveledUp: boolean,
    levelName: string,
    streak: number,
    streakIncreased: boolean
}

// Calcula los cambios de puntos/exp/nivel/racha. No escribe: devuelve los campos para updateDoc.
const buildRewardUpdates = (data: userDataFromFirebaseType, points: number, exp: number, reason: string, countsForStreak = true) => {
    const currentExp = data.userExpGained || 0;
    const newExp = Math.max(0, currentExp + exp);
    const newPoints = Math.max(0, (data.saverLevel?.accumulatedCapypoints || 0) + points);

    const prevLevel = getSaverLevelInfo(currentExp);
    const nextLevel = getSaverLevelInfo(newExp);

    const previousStreak: streakFirebaseType = data.streak ?? { current: 0, best: 0, lastActiveDate: "" };
    let streak = previousStreak;
    let streakIncreased = false;

    if (countsForStreak) {
        const today = dayKey();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = dayKey(yesterdayDate);

        let current = previousStreak.current;
        if (previousStreak.lastActiveDate !== today) {
            current = previousStreak.lastActiveDate === yesterday ? previousStreak.current + 1 : 1;
            streakIncreased = true;
        }
        streak = { current, best: Math.max(previousStreak.best, current), lastActiveDate: today };
    }

    const entry: pointsHistoryFirebaseType = {
        id: newId(),
        date: Timestamp.now(),
        points,
        exp,
        reason
    };

    const updates: UpdateData = {
        userExpGained: newExp,
        "saverLevel.accumulatedCapypoints": newPoints,
        "saverLevel.saverLevelName": nextLevel.levelName,
        streak,
        pointsHistory: arrayUnion(entry)
    };

    const result: RewardResult = {
        points,
        exp,
        leveledUp: nextLevel.levelNumber > prevLevel.levelNumber,
        levelName: nextLevel.levelName,
        streak: streak.current,
        streakIncreased
    };

    return { updates, result };
};

// ---------------------------------------------------------------------------
// Normalización: deja listos los documentos viejos o recién creados
// ---------------------------------------------------------------------------

export const normalizeUserDoc = async (uid: string, data: userDataFromFirebaseType): Promise<userDataFromFirebaseType> => {
    const updates: UpdateData = {};
    const fixed: userDataFromFirebaseType = { ...data };

    // Ids para poder editar/eliminar movimientos (HU22, HU23)
    if ((data.realIncomes || []).some((i) => !i.id)) {
        fixed.realIncomes = (data.realIncomes || []).map((i) => (i.id ? i : { ...i, id: newId() }));
        updates.realIncomes = fixed.realIncomes;
    }
    if ((data.realExpenses || []).some((e) => !e.id)) {
        fixed.realExpenses = (data.realExpenses || []).map((e) => (e.id ? e : { ...e, id: newId() }));
        updates.realExpenses = fixed.realExpenses;
    }

    // Misiones y recompensas iniciales (HU41, HU48)
    if (!data.missionsData || data.missionsData.length === 0) {
        fixed.missionsData = DEFAULT_MISSIONS;
        updates.missionsData = DEFAULT_MISSIONS;
    }
    if (!data.exchangeData || data.exchangeData.length === 0) {
        fixed.exchangeData = DEFAULT_EXCHANGES;
        updates.exchangeData = DEFAULT_EXCHANGES;
    }

    // Campos nuevos
    if (!data.pointsHistory) {
        fixed.pointsHistory = [];
        updates.pointsHistory = [];
    }
    if (!data.streak) {
        fixed.streak = { current: 0, best: 0, lastActiveDate: "" };
        updates.streak = fixed.streak;
    }
    if (data.welcomeSeen === undefined) {
        // Las cuentas que ya existían no ven la bienvenida
        fixed.welcomeSeen = true;
        updates.welcomeSeen = true;
    }
    for (const key of ["realIncomes", "realExpenses", "plannedExpenses", "cards", "savingsData"] as const) {
        if (!data[key]) {
            (fixed as unknown as Record<string, unknown>)[key] = [];
            updates[key] = [];
        }
    }

    // Nivel correcto según la experiencia (HU45)
    const levelName = getSaverLevelInfo(data.userExpGained || 0).levelName;
    if (!data.saverLevel || data.saverLevel.saverLevelName !== levelName) {
        fixed.saverLevel = {
            saverLevelName: levelName,
            goalsCompleted: data.saverLevel?.goalsCompleted || 0,
            accumulatedCapypoints: data.saverLevel?.accumulatedCapypoints || 0
        };
        updates.saverLevel = fixed.saverLevel;
    }

    if (Object.keys(updates).length > 0) {
        await updateDoc(userRef(uid), updates);
    }

    return fixed;
};

// ---------------------------------------------------------------------------
// HU09: bienvenida al crear la cuenta
// ---------------------------------------------------------------------------

export const markWelcomeSeen = async (uid: string) => {
    await updateDoc(userRef(uid), { welcomeSeen: true });
};

// ---------------------------------------------------------------------------
// Movimientos: ingresos y gastos (HU20, HU22, HU23, HU30)
// ---------------------------------------------------------------------------

export interface IncomeInput {
    incomeCategory: incomeNameCategories,
    incomeEntrie: incomeNameEntries,
    incomeAmount: number,
    incomeDate: Date
}

export interface ExpenseInput {
    expenseCategory: expenseNameCategories,
    expenseSite: string,
    expenseAmount: number,
    expenseDate: Date
}

const validateAmount = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) throw { code: "movement/invalid-amount" };
};

// HU30: revisa si el gasto del mes en esa categoría se acerca al presupuesto planeado
export interface BudgetAlert {
    category: string,
    spent: number,
    budget: number,
    percentage: number,
    exceeded: boolean
}

const checkBudget = (expenses: Array<realExpenseFirebaseType>, planned: Array<plannedExpenseFirebaseType>, category: string): BudgetAlert | null => {
    const budget = (planned || [])
        .filter((p) => p.expenseCategory === category)
        .reduce((acc, p) => acc + p.expenseAmount, 0);
    if (budget <= 0) return null;

    const spent = expenses
        .filter((e) => e.expenseCategory === category && isSameMonth(e.expenseDate.toDate()))
        .reduce((acc, e) => acc + e.expenseAmount, 0);

    const percentage = (spent / budget) * 100;
    if (percentage < 80) return null;

    return { category, spent, budget, percentage, exceeded: percentage >= 100 };
};

export const addIncome = async (uid: string, input: IncomeInput): Promise<RewardResult> => {
    validateAmount(input.incomeAmount);
    const data = await readUser(uid);

    const income: realIncomeFirebaseType = {
        id: newId(),
        incomeCategory: input.incomeCategory,
        incomeEntrie: input.incomeEntrie,
        incomeAmount: input.incomeAmount,
        incomeDate: Timestamp.fromDate(input.incomeDate),
        incomeColor: INCOME_COLORS[input.incomeEntrie] || "#9E9E9E"
    };

    const { updates, result } = buildRewardUpdates(data, ACTION_REWARDS.income.points, ACTION_REWARDS.income.exp, ACTION_REWARDS.income.reason);

    await updateDoc(userRef(uid), {
        ...updates,
        realIncomes: [...(data.realIncomes || []), income],
        totalIncome: (data.totalIncome || 0) + input.incomeAmount,
        totalBalance: (data.totalBalance || 0) + input.incomeAmount
    });

    return result;
};

export const addExpense = async (uid: string, input: ExpenseInput): Promise<{ reward: RewardResult, budgetAlert: BudgetAlert | null }> => {
    validateAmount(input.expenseAmount);
    const data = await readUser(uid);

    const expense: realExpenseFirebaseType = {
        id: newId(),
        expenseCategory: input.expenseCategory,
        expenseSite: input.expenseSite.trim() || input.expenseCategory,
        expenseAmount: input.expenseAmount,
        expenseDate: Timestamp.fromDate(input.expenseDate),
        expenseColor: EXPENSE_COLORS[input.expenseCategory] || "#9E9E9E"
    };

    const newExpenses = [...(data.realExpenses || []), expense];
    const { updates, result } = buildRewardUpdates(data, ACTION_REWARDS.expense.points, ACTION_REWARDS.expense.exp, ACTION_REWARDS.expense.reason);

    await updateDoc(userRef(uid), {
        ...updates,
        realExpenses: newExpenses,
        totalExpenses: (data.totalExpenses || 0) + input.expenseAmount,
        totalBalance: (data.totalBalance || 0) - input.expenseAmount
    });

    return { reward: result, budgetAlert: checkBudget(newExpenses, data.plannedExpenses, input.expenseCategory) };
};

export const updateIncome = async (uid: string, incomeId: string, input: IncomeInput) => {
    validateAmount(input.incomeAmount);
    const data = await readUser(uid);
    const old = (data.realIncomes || []).find((i) => i.id === incomeId);
    if (!old) throw { code: "not-found" };

    const delta = input.incomeAmount - old.incomeAmount;
    const realIncomes = data.realIncomes.map((i) => i.id === incomeId ? {
        ...i,
        incomeCategory: input.incomeCategory,
        incomeEntrie: input.incomeEntrie,
        incomeAmount: input.incomeAmount,
        incomeDate: Timestamp.fromDate(input.incomeDate),
        incomeColor: INCOME_COLORS[input.incomeEntrie] || i.incomeColor
    } : i);

    await updateDoc(userRef(uid), {
        realIncomes,
        totalIncome: (data.totalIncome || 0) + delta,
        totalBalance: (data.totalBalance || 0) + delta
    });
};

export const updateExpense = async (uid: string, expenseId: string, input: ExpenseInput): Promise<BudgetAlert | null> => {
    validateAmount(input.expenseAmount);
    const data = await readUser(uid);
    const old = (data.realExpenses || []).find((e) => e.id === expenseId);
    if (!old) throw { code: "not-found" };

    const delta = input.expenseAmount - old.expenseAmount;
    const realExpenses = data.realExpenses.map((e) => e.id === expenseId ? {
        ...e,
        expenseCategory: input.expenseCategory,
        expenseSite: input.expenseSite.trim() || input.expenseCategory,
        expenseAmount: input.expenseAmount,
        expenseDate: Timestamp.fromDate(input.expenseDate),
        expenseColor: EXPENSE_COLORS[input.expenseCategory] || e.expenseColor
    } : e);

    await updateDoc(userRef(uid), {
        realExpenses,
        totalExpenses: (data.totalExpenses || 0) + delta,
        totalBalance: (data.totalBalance || 0) - delta
    });

    return checkBudget(realExpenses, data.plannedExpenses, input.expenseCategory);
};

export const deleteIncome = async (uid: string, incomeId: string) => {
    const data = await readUser(uid);
    const old = (data.realIncomes || []).find((i) => i.id === incomeId);
    if (!old) throw { code: "not-found" };

    await updateDoc(userRef(uid), {
        realIncomes: data.realIncomes.filter((i) => i.id !== incomeId),
        totalIncome: (data.totalIncome || 0) - old.incomeAmount,
        totalBalance: (data.totalBalance || 0) - old.incomeAmount
    });
};

export const deleteExpense = async (uid: string, expenseId: string) => {
    const data = await readUser(uid);
    const old = (data.realExpenses || []).find((e) => e.id === expenseId);
    if (!old) throw { code: "not-found" };

    await updateDoc(userRef(uid), {
        realExpenses: data.realExpenses.filter((e) => e.id !== expenseId),
        totalExpenses: (data.totalExpenses || 0) - old.expenseAmount,
        totalBalance: (data.totalBalance || 0) + old.expenseAmount
    });
};

// ---------------------------------------------------------------------------
// Presupuesto mensual (planner) (HU29)
// ---------------------------------------------------------------------------

export const addPlannedExpense = async (uid: string, input: { expenseCategory: expenseNameCategories, expenseSite: string, expenseAmount: number, expenseEntrie: incomeNameEntries }): Promise<RewardResult> => {
    validateAmount(input.expenseAmount);
    if (input.expenseCategory === expenseNameCategories.category) throw { code: "movement/missing-category" };
    const data = await readUser(uid);

    const planned: plannedExpenseFirebaseType = {
        expenseCategory: input.expenseCategory,
        expenseSite: input.expenseSite.trim(),
        expenseAmount: input.expenseAmount,
        expenseEntrie: input.expenseEntrie,
        expenseDate: Timestamp.now()
    };

    const { updates, result } = buildRewardUpdates(data, ACTION_REWARDS.plannedExpense.points, ACTION_REWARDS.plannedExpense.exp, ACTION_REWARDS.plannedExpense.reason);

    await updateDoc(userRef(uid), {
        ...updates,
        plannedExpenses: [...(data.plannedExpenses || []), planned]
    });

    return result;
};

export const deletePlannedExpense = async (uid: string, index: number) => {
    const data = await readUser(uid);
    await updateDoc(userRef(uid), {
        plannedExpenses: (data.plannedExpenses || []).filter((_, i) => i !== index)
    });
};

// ---------------------------------------------------------------------------
// Metas de ahorro (HU32, HU33, HU34, HU35, HU36)
// ---------------------------------------------------------------------------

const SAVING_COLORS: Record<string, string> = {
    blue: "#2D18BF",
    green: "#A8F25D",
    orange: "#F2622E"
};

export interface SavingInput {
    savingName: string,
    savingColor: string, // "blue" | "green" | "orange" o un hex
    savingImage: savingEnum,
    savingTotalFee: number,
    monthlySaving: number
}

const validateSaving = (input: { savingName: string, savingTotalFee: number, monthlySaving: number }) => {
    if (!input.savingName.trim()) throw { code: "saving/missing-name" };
    if (!Number.isFinite(input.savingTotalFee) || input.savingTotalFee <= 0) throw { code: "saving/invalid-total" };
    if (!Number.isFinite(input.monthlySaving) || input.monthlySaving <= 0) throw { code: "saving/invalid-monthly" };
    if (input.monthlySaving > input.savingTotalFee) throw { code: "saving/monthly-greater-than-total" };
};

export const createSaving = async (uid: string, input: SavingInput): Promise<RewardResult> => {
    validateSaving(input);
    const data = await readUser(uid);
    const name = input.savingName.trim();

    if ((data.savingsData || []).some((s) => s.savingName.toLowerCase() === name.toLowerCase())) {
        throw { code: "saving/duplicated-name" };
    }

    const saving: savingFirebaseType = {
        savingName: name,
        savingValue: 0,
        savingColor: SAVING_COLORS[input.savingColor] || input.savingColor || "#2D18BF",
        savingImage: input.savingImage,
        monthlySaving: input.monthlySaving,
        savingActualFee: 0,
        savingTotalFee: input.savingTotalFee,
        savingHistory: [],
        paused: false,
        completed: false
    };

    const { updates, result } = buildRewardUpdates(data, ACTION_REWARDS.createSaving.points, ACTION_REWARDS.createSaving.exp, ACTION_REWARDS.createSaving.reason);

    await updateDoc(userRef(uid), {
        ...updates,
        savingsData: [...(data.savingsData || []), saving]
    });

    return result;
};

export interface DepositResult {
    reward: RewardResult,
    goalCompleted: boolean,
    savingName: string
}

// HU33: registrar un aporte (por defecto, el ahorro mensual)
export const depositToSaving = async (uid: string, savingName: string, amount?: number): Promise<DepositResult> => {
    const data = await readUser(uid);
    const saving = (data.savingsData || []).find((s) => s.savingName === savingName);
    if (!saving) throw { code: "not-found" };
    if (saving.paused) throw { code: "saving/paused" };
    if (saving.completed) throw { code: "saving/completed" };

    const deposit = amount ?? saving.monthlySaving;
    validateAmount(deposit);

    const newActual = saving.savingActualFee + deposit;
    const goalCompleted = newActual >= saving.savingTotalFee;

    const savingsData = data.savingsData.map((s) => s.savingName === savingName ? {
        ...s,
        savingValue: s.savingValue + deposit,
        savingActualFee: newActual,
        savingHistory: [...(s.savingHistory || []), { date: Timestamp.now(), deposit }],
        completed: goalCompleted
    } : s);

    // Puntos por el aporte y, si la meta se cumplió, un bono extra (HU36)
    const bonus = goalCompleted ? ACTION_REWARDS.goalCompleted : { points: 0, exp: 0 };
    const reason = goalCompleted
        ? `${ACTION_REWARDS.deposit.reason} and completed "${savingName}"`
        : `${ACTION_REWARDS.deposit.reason} ("${savingName}")`;
    const { updates, result } = buildRewardUpdates(
        data,
        ACTION_REWARDS.deposit.points + bonus.points,
        ACTION_REWARDS.deposit.exp + bonus.exp,
        reason
    );

    const extra: UpdateData = {};
    if (goalCompleted) {
        extra["saverLevel.goalsCompleted"] = (data.saverLevel?.goalsCompleted || 0) + 1;
    }

    await updateDoc(userRef(uid), {
        ...updates,
        ...extra,
        savingsData,
        totalSavings: (data.totalSavings || 0) + deposit
    });

    return { reward: result, goalCompleted, savingName };
};

// HU34: editar nombre, monto total o aporte mensual
export const editSaving = async (uid: string, originalName: string, input: { savingName: string, savingTotalFee: number, monthlySaving: number }) => {
    validateSaving(input);
    const data = await readUser(uid);
    const name = input.savingName.trim();

    if (!(data.savingsData || []).some((s) => s.savingName === originalName)) throw { code: "not-found" };
    if (name.toLowerCase() !== originalName.toLowerCase() &&
        data.savingsData.some((s) => s.savingName.toLowerCase() === name.toLowerCase())) {
        throw { code: "saving/duplicated-name" };
    }

    const savingsData = data.savingsData.map((s) => s.savingName === originalName ? {
        ...s,
        savingName: name,
        savingTotalFee: input.savingTotalFee,
        monthlySaving: input.monthlySaving,
        completed: s.savingActualFee >= input.savingTotalFee
    } : s);

    await updateDoc(userRef(uid), { savingsData });
};

// HU35: pausar / reanudar
export const toggleSavingPause = async (uid: string, savingName: string): Promise<boolean> => {
    const data = await readUser(uid);
    const saving = (data.savingsData || []).find((s) => s.savingName === savingName);
    if (!saving) throw { code: "not-found" };

    const paused = !saving.paused;
    await updateDoc(userRef(uid), {
        savingsData: data.savingsData.map((s) => s.savingName === savingName ? { ...s, paused } : s)
    });
    return paused;
};

// HU35: eliminar
export const deleteSavingGoal = async (uid: string, savingName: string) => {
    const data = await readUser(uid);
    const saving = (data.savingsData || []).find((s) => s.savingName === savingName);
    if (!saving) throw { code: "not-found" };

    await updateDoc(userRef(uid), {
        savingsData: data.savingsData.filter((s) => s.savingName !== savingName),
        totalSavings: Math.max(0, (data.totalSavings || 0) - saving.savingActualFee)
    });
};

// ---------------------------------------------------------------------------
// Misiones (HU41, HU42)
// ---------------------------------------------------------------------------

export const completeMission = async (uid: string, missionId: number): Promise<RewardResult> => {
    const data = await readUser(uid);
    const mission = (data.missionsData || []).find((m) => m.missionId === missionId);
    if (!mission) throw { code: "not-found" };
    if (mission.completed) throw { code: "mission/already-completed" };

    // Las condiciones solo revisan cantidades, por eso sirven con los datos de Firestore
    const condition = missionConditions[missionId];
    const ctx = {
        savings: data.savingsData || [],
        incomes: data.realIncomes || [],
        plannedExpenses: data.plannedExpenses || [],
        realExpenses: data.realExpenses || []
    } as unknown as missionContext;
    if (condition && !condition(ctx)) throw { code: "mission/not-ready" };

    const missionsData = data.missionsData.map((m) => m.missionId === missionId ? { ...m, completed: true } : m);
    const { updates, result } = buildRewardUpdates(data, mission.missionCapypoints, mission.missionExp, `Mission completed: ${mission.missionName}`);

    await updateDoc(userRef(uid), {
        ...updates,
        missionsData,
        "saverLevel.goalsCompleted": (data.saverLevel?.goalsCompleted || 0) + 1
    });

    return result;
};

// ---------------------------------------------------------------------------
// Recompensas (HU48, HU50, HU51)
// ---------------------------------------------------------------------------

export const redeemReward = async (uid: string, exchangeId: number) => {
    const data = await readUser(uid);
    const reward = (data.exchangeData || []).find((e) => e.exchangeId === exchangeId);
    if (!reward) throw { code: "not-found" };
    if (reward.isRedeemed) throw { code: "reward/already-redeemed" };

    const points = data.saverLevel?.accumulatedCapypoints || 0;
    if (points < reward.redemptionCapypointsAmount) {
        throw { code: "reward/not-enough-points", missing: reward.redemptionCapypointsAmount - points };
    }

    const exchangeData = data.exchangeData.map((e) => e.exchangeId === exchangeId
        ? { ...e, isRedeemed: true, redeemedAt: new Date().toISOString() }
        : e);

    // Se descuentan los puntos (queda en el historial como negativo). No cuenta para la racha.
    const { updates } = buildRewardUpdates(data, -reward.redemptionCapypointsAmount, 0, `Redeemed ${reward.name}`, false);

    await updateDoc(userRef(uid), {
        ...updates,
        exchangeData,
        // Igual que antes: el valor de la recompensa se suma al ingreso total
        totalIncome: (data.totalIncome || 0) + reward.redemptionCost
    });
};

// ---------------------------------------------------------------------------
// HU60: opinión sobre Capy (colección "feedback")
// ---------------------------------------------------------------------------

export const sendFeedback = async (uid: string, email: string, rating: number, message: string) => {
    if (!rating || rating < 1 || rating > 5) throw { code: "feedback/missing-rating" };
    await addDoc(collection(db, "feedback"), {
        userUID: uid,
        email,
        rating,
        message: message.trim(),
        createdAt: serverTimestamp()
    });
};

// ---------------------------------------------------------------------------
// Mensajes de error de estas acciones
// ---------------------------------------------------------------------------

export const getActionErrorMessage = (err: unknown): string => {
    const e = err as { code?: string, missing?: number, message?: string };
    switch (e?.code) {
        case "movement/invalid-amount": return "El monto debe ser mayor que 0.";
        case "movement/missing-category": return "Elige una categoría.";
        case "saving/missing-name": return "Escribe el nombre de la meta.";
        case "saving/invalid-total": return "El monto total debe ser mayor que 0.";
        case "saving/invalid-monthly": return "El aporte mensual debe ser mayor que 0.";
        case "saving/monthly-greater-than-total": return "El aporte mensual no puede ser mayor que el monto total.";
        case "saving/duplicated-name": return "Ya tienes una meta con ese nombre.";
        case "saving/paused": return "Esta meta está pausada. Reanúdala para hacer aportes.";
        case "saving/completed": return "Esta meta ya está cumplida.";
        case "mission/not-ready": return "Todavía no cumples el requisito de esta misión.";
        case "mission/already-completed": return "Ya completaste esta misión.";
        case "reward/not-enough-points": return `Te faltan ${e.missing ?? ""} Capypoints para canjear esta recompensa.`;
        case "reward/already-redeemed": return "Ya canjeaste esta recompensa.";
        case "feedback/missing-rating": return "Elige una calificación de 1 a 5.";
        case "not-found": return "No se encontró el dato. Recarga la página.";
        case "permission-denied": return "Firestore rechazó la operación (revisa las reglas de seguridad).";
        case "unavailable": return "No hay conexión con la base de datos.";
        case "auth/no-current-user": return "Tu sesión expiró. Inicia sesión de nuevo.";
        default: return `Error: ${e?.code || e?.message || "desconocido"}`;
    }
};
