import { incomeNameEntries } from "../incomes/types"

export interface expensesSliceType {
    realExpenses: Array<realExpenseType>,
    plannedExpenses: Array<plannedExpenseType>,
}

export enum expenseNameCategories {
    category = "Category",
    hogar = "Home",
    mercado = "Groceries",
    ropa = "Clothes",
    salidas = "Hang outs",
    viajes = "Trips",
    familia = "Family",
    Amigos = "Friends",
    otro = "Others"
}

export interface realExpenseType {
    expenseCategory: expenseNameCategories,
    expenseSite: string,
    expenseDate: string,
    expenseAmount: number,
    expenseImage?: string,
    expenseColor: string
}

export interface plannedExpenseType {
    expenseCategory: expenseNameCategories,
    expenseSite: string,
    expenseDate: string,
    expenseAmount: number,
    expenseEntrie: incomeNameEntries
}