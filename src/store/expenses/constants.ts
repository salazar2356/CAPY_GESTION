import { expensesSliceType } from "./types"

export const EXPENSES_SLICE_NAME = "expenses"

export const DEFAULT_STATE_EXPENSES: expensesSliceType = {
    realExpenses: [],
    plannedExpenses: []
}