import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_STATE_SAVINGS, SAVINGS_SLICE_NAME } from "./constants";
import { savingSliceType, savingType } from "./types";

export const savingsSlice = createSlice({
    name: SAVINGS_SLICE_NAME,
    initialState: {
        ...DEFAULT_STATE_SAVINGS
    },
    reducers: {
        addSaving: (state, action: PayloadAction<savingType>) => {
            state.savingsData = [
                {
                    savingName: action.payload.savingName,
                    savingValue: 0,
                    savingColor: action.payload.savingColor,
                    monthlySaving: action.payload.monthlySaving,
                    savingActualFee: 0,
                    savingTotalFee: action.payload.savingTotalFee,
                    savingHistory: [],
                    savingImage: action.payload.savingImage
                },
                ...state.savingsData
            ]
        },
        updateAllSavingsSlice: (state, action: PayloadAction<savingSliceType>) => {
            return {
                ...state,
                savingsData: [...action.payload.savingsData]
            }
        }
    }
})

export const { addSaving, updateAllSavingsSlice } = savingsSlice.actions