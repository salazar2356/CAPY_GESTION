import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_STATE_EXPENSES, EXPENSES_SLICE_NAME } from "./constants";
import { expensesSliceType, plannedExpenseType, realExpenseType } from "./types";

export const expensesSlice = createSlice({
    name: EXPENSES_SLICE_NAME,
    initialState: {
        ...DEFAULT_STATE_EXPENSES
    },
    reducers: {
        addRealExpense: (store, action: PayloadAction<realExpenseType>) => {
            store.realExpenses = [
                ...store.realExpenses,
                {
                    expenseCategory: action.payload.expenseCategory,
                    expenseSite: action.payload.expenseSite,
                    expenseDate: action.payload.expenseDate,
                    expenseAmount: action.payload.expenseAmount,
                    expenseColor: action.payload.expenseColor
                }
            ]
        },
        addPlannedExpense: (store, action: PayloadAction<plannedExpenseType>) => {
            store.plannedExpenses = [
                ...store.plannedExpenses,
                {
                    expenseCategory: action.payload.expenseCategory,
                    expenseSite: action.payload.expenseSite,
                    expenseDate: action.payload.expenseDate,
                    expenseAmount: action.payload.expenseAmount,
                    expenseEntrie: action.payload.expenseEntrie
                }
            ]
        },
        deletePlannedExpense: (store, action: PayloadAction<string>) => {
            store.plannedExpenses = store.plannedExpenses.filter(
                income => income.expenseDate !== action.payload
            );
        },
        updateAllExpensesSlice: (state, action: PayloadAction<expensesSliceType>) => {
            return {
                ...state,
                realExpenses: [...action.payload.realExpenses],
                plannedExpenses: [...action.payload.plannedExpenses]
            }
        }
    }
})

export const { addPlannedExpense, addRealExpense, deletePlannedExpense, updateAllExpensesSlice } = expensesSlice.actions