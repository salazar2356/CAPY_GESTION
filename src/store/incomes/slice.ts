import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_STATE_INCOMES, INCOMES_SLICE_NAME } from "./constants";
import { incomesSliceType, realIncomeType } from "./types";

export const incomesSlice = createSlice({
    name: INCOMES_SLICE_NAME,
    initialState: {
        ...DEFAULT_STATE_INCOMES
    },
    reducers: {
        addRealIncome: (store, action: PayloadAction<realIncomeType>) => {
            store.realIncomes = [
                ...store.realIncomes,
                {
                    incomeCategory: action.payload.incomeCategory,
                    incomeEntrie: action.payload.incomeEntrie,
                    incomeDate: action.payload.incomeDate,
                    incomeAmount: action.payload.incomeAmount,
                    incomeColor: action.payload.incomeColor
                }
            ]
        },
        updateAllIncomesSlice: (state, action: PayloadAction<incomesSliceType>) => {
            return {
                ...state,
                realIncomes: [...action.payload.realIncomes]
            }
        }
    }
})

export const { addRealIncome, updateAllIncomesSlice } = incomesSlice.actions