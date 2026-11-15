import { Timestamp } from "firebase/firestore"
import { expenseNameCategories } from "../store/expenses/types"
import { incomeNameCategories, incomeNameEntries } from "../store/incomes/types"
import { exchangeType, missionType, saverLevelsNames } from "../store/rewards/types"
import { savingEnum } from "../store/savings/types"
import { cardType } from "../store/userData/types"

export interface userDataFromFirebaseType {
    name: string,
    email: string,
    userUID: string,
    totalBalance: number,
    totalExpenses: number,
    totalIncome: number,
    totalSavings: number,
    userExpGained: number,
    saverLevel: {
        saverLevelName: saverLevelsNames,
        goalsCompleted: number,
        accumulatedCapypoints: number
    },
    realExpenses: Array<realExpenseFirebaseType>
    realIncomes: Array<realIncomeFirebaseType>,
    plannedExpenses: Array<plannedExpenseFirebaseType>
    cards: Array<cardType>,
    exchangeData: Array<exchangeType>,
    missionsData: Array<missionType>,
    savingsData: Array<savingFirebaseType>,
    // Campos nuevos (opcionales para que las cuentas viejas sigan funcionando)
    pointsHistory?: Array<pointsHistoryFirebaseType>,
    streak?: streakFirebaseType,
    welcomeSeen?: boolean,
    premiumInterest?: boolean,       // HU59
    premiumInterestAt?: Timestamp,
    assistantEnabled?: boolean,      // HU52
    avatar?: string,                 // HU14: "capy:#2D18BF" o una imagen "data:image/jpeg;base64,..."
    weeklyMissions?: weeklyMissionsFirebaseType, // HU43
    paymentMethods?: Array<paymentMethodType>,   // HU18
    notificationPrefs?: notificationPrefsType     // HU56
}

// HU18: medio de pago (sin datos sensibles: solo los últimos 4 dígitos)
export interface paymentMethodType {
    id: string,
    name: string,
    type: string,
    last4?: string
}

// HU56: preferencias de notificaciones
export interface notificationPrefsType {
    dailyReminder: boolean,
    reminderHour: string,   // "20:00"
    budgetAlerts: boolean,
    goalReminders: boolean,
    newMissions: boolean
}

// HU43: misiones que cambian cada semana (lunes a domingo)
export interface weeklyMissionFirebaseType {
    id: string,
    kind: string,
    name: string,
    description: string,
    color: string,
    capypoints: number,
    exp: number,
    target: number,
    completed: boolean
}

export interface weeklyMissionsFirebaseType {
    weekStart: string, // YYYY-MM-DD (lunes)
    missions: Array<weeklyMissionFirebaseType>
}

// HU46: cada vez que el usuario gana o gasta Capypoints
export interface pointsHistoryFirebaseType {
    id: string,
    date: Timestamp,
    points: number,
    exp: number,
    reason: string
}

// HU44: racha de días con actividad financiera
export interface streakFirebaseType {
    current: number,
    best: number,
    lastActiveDate: string // formato YYYY-MM-DD
}

export interface realIncomeFirebaseType {
    id?: string,
    incomeCategory: incomeNameCategories,
    incomeEntrie: incomeNameEntries,
    incomeDate: Timestamp,
    incomeAmount: number,
    incomeColor: string
    incomeImage?: string
}

export interface realExpenseFirebaseType {
    id?: string,
    paymentMethodId?: string,  // HU18
    expenseCategory: expenseNameCategories,
    expenseSite: string,
    expenseDate: Timestamp,
    expenseAmount: number,
    expenseColor: string
}

export interface plannedExpenseFirebaseType {
    expenseCategory: expenseNameCategories,
    expenseSite: string,
    expenseDate: Timestamp,
    expenseAmount: number,
    expenseEntrie: incomeNameEntries
}

export interface savingFirebaseType {
    savingName: string,
    savingValue: number,
    savingColor: string,
    savingImage: savingEnum,
    monthlySaving: number,
    savingActualFee: number,
    savingTotalFee: number,
    savingHistory: Array<savingHistoryFirebaseType>,
    paused?: boolean,     // HU35
    completed?: boolean   // HU36
}

export interface savingHistoryFirebaseType {
    date: Timestamp,
    deposit: number,      // negativo cuando es un retiro (HU38)
    reason?: string       // motivo del retiro (HU38)
}