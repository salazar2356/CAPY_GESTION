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
    savingsData: Array<savingFirebaseType>
}

export interface realIncomeFirebaseType {
    incomeCategory: incomeNameCategories,
    incomeEntrie: incomeNameEntries,
    incomeDate: Timestamp,
    incomeAmount: number,
    incomeColor: string
    incomeImage?: string
}

interface realExpenseFirebaseType {
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
    savingHistory: Array<savingHistoryFirebaseType>
}

interface savingHistoryFirebaseType {
    date: Timestamp,
    deposit: number
}