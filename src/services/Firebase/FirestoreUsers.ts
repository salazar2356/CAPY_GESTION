// Required for side-effects
import "firebase/firestore";

import { deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db, auth } from "./Firebase";
import { exchangeNameEnum, exchangeType, missionType, saverLevelsNames, summaryType } from "../../store/rewards/types";
import { expenseNameCategories } from "../../store/expenses/types";
import { incomeNameCategories, incomeNameEntries } from "../../store/incomes/types";
import { cardNamesEnum } from "../../store/userData/types";
import { plannedExpenseFirebaseType, savingFirebaseType, userDataFromFirebaseType } from "../../types/firebaseUserTypes";
import { savingEnum } from "../../store/savings/types";
import { getCurrentTimestamp } from "../../utils/timestampConvertion";

// Colección donde la app guarda los datos reales de cada usuario
const REAL_USERS = "realUsers";

// Alias para que CardLogIn y CardRegister usen el mismo tipo
export type UserData = userDataFromFirebaseType;

export const getUser = async (userUID: string) => {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}

export const getRealUser = async (userUID: string) => {
    const docRef = doc(db, REAL_USERS, userUID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as userDataFromFirebaseType;
    } else {
        // Si el usuario está logueado pero aún no tiene documento, se lo creamos
        const current = auth.currentUser;
        if (current && current.uid === userUID) {
            return ensureUserDoc(current);
        }
        console.log("No such document!");
    }
}

export const createUser = async (userUIDForm: string, nameForm: string, emailForm: string) => {
    await setDoc(doc(db, "users", userUIDForm), {
        name: nameForm,
        email: emailForm,
        userUID: userUIDForm,
        totalBalance: 0,
        totalExpenses: 0,
        totalIncome: 0,
        savings: 0,
        playerLevel: {
            playerLevelName: "Novice",
            playerExp: 0,
            expToNextLevel: 100
        },
        expenses: {},
        income: {},
        cards: {}
    });

    const docRef = doc(db, "users", userUIDForm);
    const data = await getDoc(docRef);
    return data.data()
}

export const createFinalUser = async (userUIDForm: string, nameForm: string, emailForm: string) => {
    const newUserObject: userDataFromFirebaseType = {
        name: nameForm,
        email: emailForm,
        userUID: userUIDForm,
        totalBalance: 0,
        totalExpenses: 0,
        totalIncome: 0,
        totalSavings: 0,
        userExpGained: 0,
        saverLevel: {
            saverLevelName: saverLevelsNames.level1,
            goalsCompleted: 0,
            accumulatedCapypoints: 0
        },
        realExpenses: [],
        realIncomes: [],
        plannedExpenses: [],
        cards: [],
        exchangeData: [],
        missionsData: [],
        savingsData: []
    }

    await setDoc(doc(db, REAL_USERS, userUIDForm), newUserObject);

    const docRef = doc(db, REAL_USERS, userUIDForm);
    const data = await getDoc(docRef);
    return data.data() as userDataFromFirebaseType
}

// Devuelve los datos del usuario en realUsers; si no existen (Google o cuentas viejas) los crea
export const ensureUserDoc = async (user: User): Promise<userDataFromFirebaseType> => {
    const snap = await getDoc(doc(db, REAL_USERS, user.uid));
    if (snap.exists()) return snap.data() as userDataFromFirebaseType;

    return createFinalUser(
        user.uid,
        user.displayName || user.email?.split("@")[0] || "Usuario",
        user.email || ""
    );
}

// Actualizar nombre (HU12)
export const updateUserName = async (uid: string, name: string) => {
    await updateDoc(doc(db, REAL_USERS, uid), { name });
}

// Actualizar correo (HU12)
export const updateUserEmail = async (uid: string, email: string) => {
    await updateDoc(doc(db, REAL_USERS, uid), { email });
}

// Borrar los datos del usuario en Firestore (HU58). Se llama ANTES de borrar la cuenta de Auth
export const deleteUserData = async (uid: string) => {
    await deleteDoc(doc(db, REAL_USERS, uid));
    await deleteDoc(doc(db, "users", uid)); // datos de la versión antigua, si existen
}

export const createPruebaUser = async (userUIDForm: string, nameForm: string, emailForm: string) => {
    const newUserObject: userDataFromFirebaseType = {
        name: nameForm,
        email: emailForm,
        userUID: userUIDForm,
        totalBalance: 550000,
        totalExpenses: 0,
        totalIncome: 0,
        totalSavings: 0,
        userExpGained: 0,
        saverLevel: {
            saverLevelName: saverLevelsNames.level1,
            goalsCompleted: 0,
            accumulatedCapypoints: 0
        },
        realExpenses: [
            {
                expenseCategory: expenseNameCategories.Amigos,
                expenseSite: "Cine local",
                expenseDate: Timestamp.fromDate(new Date("2024-08-20")),
                expenseAmount: 500,
                expenseColor: "#FFFFFF"
            },
            {
                expenseCategory: expenseNameCategories.salidas,
                expenseSite: "Cine local",
                expenseDate: Timestamp.fromDate(new Date("2024-09-20")),
                expenseAmount: 200,
                expenseColor: "#2D18BF"
            },
        ],
        realIncomes: [
            {
                incomeCategory: incomeNameCategories.work,
                incomeEntrie: incomeNameEntries.nu,
                incomeDate: Timestamp.fromDate(new Date("2024-9-10")),
                incomeAmount: 3500,
                incomeColor: "#2D18BF"
            },
            {
                incomeCategory: incomeNameCategories.freelance,
                incomeEntrie: incomeNameEntries.masterCard,
                incomeDate: Timestamp.fromDate(new Date("2024-10-15")),
                incomeAmount: 1500,
                incomeColor: "#F9F9F9"
            }
        ],
        plannedExpenses: [
            {
                expenseCategory: expenseNameCategories.viajes,
                expenseSite: "Hotel Playa",
                expenseDate: Timestamp.fromDate(new Date("2024-11-05")),
                expenseAmount: 500,
                expenseEntrie: incomeNameEntries.masterCard
            },
            {
                expenseCategory: expenseNameCategories.familia,
                expenseSite: "Regalo familiar",
                expenseDate: Timestamp.fromDate(new Date("2024-11-10")),
                expenseAmount: 200,
                expenseEntrie: incomeNameEntries.visa
            }
        ],
        cards: [
            {
                cardName: cardNamesEnum.nu,
                cardNumber: 2398,
                cardMoney: 30000
            },
            {
                cardName: cardNamesEnum.visa,
                cardNumber: 1864,
                cardMoney: 12000
            }
        ],
        exchangeData: [
            {
                name: exchangeNameEnum.amazon,
                redemptionCapypointsAmount: 1000,
                redemptionCost: 10000,
                isRedeemed: false,
                exchangeId: 0,
                backgroundColor: '#4A00E0',
                darkText: false
            },
            {
                name: exchangeNameEnum.netflix,
                redemptionCapypointsAmount: 1500,
                redemptionCost: 25000,
                isRedeemed: false,
                exchangeId: 1,
                backgroundColor: '#F2622E',
                darkText: false
            }
        ],
        missionsData: [
            {
                missionName: "Reduce costs",
                missionDescription: "Limit spending on entertainment and non-essential purchases to 15% of the monthly budget.",
                missionColor: "#2D18BF",
                missionCapypoints: 500,
                completed: false,
                missionId: 0,
                missionExp: 300
            },
            {
                missionName: "Save some money",
                missionDescription: "Save a specific amount at the end of each week (e.g. save $5 each week).",
                missionColor: "#CCFC56",
                missionCapypoints: 1000,
                completed: false,
                missionId: 1,
                missionExp: 360
            }
        ],
        savingsData: [
            {
                savingName: "Party",
                savingValue: 100000,
                savingColor: "#2D18BF",
                monthlySaving: 50000,
                savingActualFee: 100000,
                savingTotalFee: 600000,
                savingHistory: [
                    {
                        date: Timestamp.fromDate(new Date("2024-9-04")),
                        deposit: 50000
                    },
                    {
                        date: Timestamp.fromDate(new Date("2024-8-04")),
                        deposit: 50000
                    }
                ],
                savingImage: savingEnum.fire
            }
        ]
    }

    await setDoc(doc(db, REAL_USERS, userUIDForm), newUserObject);

    const docRef = doc(db, REAL_USERS, userUIDForm);
    const data = await getDoc(docRef);

    if (!data.exists()) {
        console.error("El documento no existe.");
        return null;
    }

    const dataJson = data.data() as userDataFromFirebaseType;
    return dataJson;
}

//Update and create new data of the aplicattion

export const updateCompletedMission = async (
    userUID: string,
    missionToUpdateId: number,
    allMissions: Array<missionType>,
    currentExp: number,
    currentGoalsCompleted: number,
    currentAccumulatedCapypoints: number,
    fetchAndSetUserData: () => void
) => {
    const docRef = doc(db, REAL_USERS, userUID);

    let completedMissionExp = 0
    let grantMissionCapypoints = 0

    // Crear un nuevo arreglo con el estado actualizado para la misión específica
    const updatedMissions = allMissions.map((mission) => {
        if (mission.missionId === missionToUpdateId) {
            completedMissionExp = mission.missionExp
            grantMissionCapypoints = mission.missionCapypoints
            return { ...mission, completed: true }
        }
        return mission
    });

    try {
        // Actualiza el documento en Firebase
        await updateDoc(docRef, {
            missionsData: updatedMissions,
            userExpGained: currentExp + completedMissionExp,
            saverLevel: {
                accumulatedCapypoints: currentAccumulatedCapypoints + grantMissionCapypoints,
                goalsCompleted: currentGoalsCompleted + 1,
                saverLevelName: ""
            }
        });

        console.log("Misión actualizada exitosamente");
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al actualizar la misión:", error);
    }
};

export const ReedemRewardFirebase = async (userUID: string, rewardToReedemId: number, allExchangeArray: Array<exchangeType>, currentTotalIncomes: number, fetchAndSetUserData: () => void, currentSaverLevel: summaryType) => {
    const docRef = doc(db, REAL_USERS, userUID);

    let exchangeCapypointsCost = 0
    let exchangeMoneyPrice = 0

    const updatedExchangeData = allExchangeArray.map((exchange) => {
        if (exchange.exchangeId === rewardToReedemId) {
            exchangeCapypointsCost = exchange.redemptionCapypointsAmount
            exchangeMoneyPrice = exchange.redemptionCost

            return { ...exchange, isRedeemed: true }
        }
        return exchange
    });

    try {
        await updateDoc(docRef, {
            exchangeData: updatedExchangeData,
            saverLevel: {
                accumulatedCapypoints: currentSaverLevel.accumulatedCapypoints - exchangeCapypointsCost,
                goalsCompleted: currentSaverLevel.goalsCompleted,
                saverLevelName: currentSaverLevel.saverLevel
            },
            totalIncome: currentTotalIncomes + exchangeMoneyPrice
        });

        console.log("Exchange actualizada exitosamente");
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al actualizar el exchange:", error);
    }
}

export const CreatedNewSaving = async (userUID: string, newSavingColor: string, newSavingImage: savingEnum, newSavingName: string, newSavingTotalFee: number, newSavingMonthlySaving: number, actualSavingsArray: Array<savingFirebaseType>, fetchAndSetUserData: () => void) => {
    const docRef = doc(db, REAL_USERS, userUID);

    let newSavingHexColor = ""

    switch (newSavingColor) {
        case "blue":
            newSavingHexColor = "#2D18BF"
            break;
        case "green":
            newSavingHexColor = "#A8F25D"
            break;
        case "orange":
            newSavingHexColor = "#F2622E"
            break;
        default:
            break;
    }

    const newItemSaving: savingFirebaseType = {
        savingName: newSavingName,
        savingValue: 0,
        savingColor: newSavingHexColor,
        savingImage: newSavingImage,
        monthlySaving: newSavingMonthlySaving,
        savingActualFee: 0,
        savingTotalFee: newSavingTotalFee,
        savingHistory: []
    }

    const newSavings = [...actualSavingsArray, newItemSaving]

    try {
        await updateDoc(docRef, {
            savingsData: newSavings
        });

        console.log("Se agrego el saving exitosamente");
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al agregar el saving:", error);
    }
}

export const EditSavingAddMonthlySaving = async function name(userUID: string, savingName: string, actualSavingsArray: Array<savingFirebaseType>, fetchAndSetUserData: () => void) {
    const docRef = doc(db, REAL_USERS, userUID);

    const updatedSavingsArray = actualSavingsArray.map((saving) => {
        if (saving.savingName === savingName) {
            return {
                savingName: savingName,
                savingValue: saving.savingValue + saving.monthlySaving,
                savingColor: saving.savingColor,
                savingImage: saving.savingImage,
                monthlySaving: saving.monthlySaving,
                savingActualFee: saving.savingActualFee + saving.monthlySaving,
                savingTotalFee: saving.savingTotalFee,
                savingHistory: [...saving.savingHistory, { date: getCurrentTimestamp(), deposit: saving.monthlySaving }]
            }
        }

        return saving
    })

    try {
        await updateDoc(docRef, {
            savingsData: updatedSavingsArray
        });

        console.log("Se actualizo el saving exitosamente");
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al agregar actualizar el saving:", error);
    }
}

export const DeleteSaving = async (userUID: string, savingNameToDelete: string, actualSavingsArray: Array<savingFirebaseType>, fetchAndSetUserData: () => void) => {
    const docRef = doc(db, REAL_USERS, userUID);

    const updatedSavingsArray = actualSavingsArray.filter(
        (saving) => saving.savingName !== savingNameToDelete
    );

    try {
        await updateDoc(docRef, {
            savingsData: updatedSavingsArray,
        });

        console.log(`El ahorro "${savingNameToDelete}" ha sido eliminado exitosamente`);
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al eliminar el ahorro:", error);
    }
}

export const CreatePlannedExpense = async (userUID: string, newExpenseCategory: expenseNameCategories, newExpenseSite: string, newExpenseAmount: number, newExpenseEntrie: incomeNameEntries, allCurrentPlannedExpenses: Array<plannedExpenseFirebaseType>, fetchAndSetUserData: () => void) => {
    const docRef = doc(db, REAL_USERS, userUID);

    const newPlannedExpense: plannedExpenseFirebaseType = {
        expenseCategory: newExpenseCategory,
        expenseSite: newExpenseSite,
        expenseDate: getCurrentTimestamp(),
        expenseAmount: newExpenseAmount,
        expenseEntrie: newExpenseEntrie
    }

    const newPlannedExpensesArray: Array<plannedExpenseFirebaseType> = [...allCurrentPlannedExpenses, newPlannedExpense]

    try {
        await updateDoc(docRef, {
            plannedExpenses: newPlannedExpensesArray
        });

        console.log("Se agrego el gasto planeado exitosamente");
        fetchAndSetUserData();
    } catch (error) {
        console.error("Error al agregar el gasto planeado:", error);
    }
}