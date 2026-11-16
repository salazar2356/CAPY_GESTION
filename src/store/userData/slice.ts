import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_STATE_USER_DATA, USER_DATA_SLICE_NAME } from "./constants";
import { cardType, userDataType } from "./types";

export const userDataSlice = createSlice({
    name: USER_DATA_SLICE_NAME,
    initialState: {
        ...DEFAULT_STATE_USER_DATA
    },
    reducers: {
        changeUserEmail: (state, action: PayloadAction<string>) => {
            state.userEmail = action.payload
        },
        changeUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload
        },
        changeUserUID: (state, action: PayloadAction<string>) => {
            state.userUID = action.payload
        },
        addUserCard: (state, action: PayloadAction<cardType>) => {
            state.cards = [
                ...state.cards,
                {
                    cardName: action.payload.cardName,
                    cardNumber: action.payload.cardNumber,
                    cardMoney: action.payload.cardMoney
                }
            ]
        },
        deleteUserCard: (state, action: PayloadAction<number>) => {
            state.cards = state.cards.filter(
                card => card.cardNumber !== action.payload
            );
        },
        changeUserTotalBalance: (state, action: PayloadAction<number>) => {
            state.totalBalance = action.payload
        },
        changeUserTotalIncome: (state, action: PayloadAction<number>) => {
            state.totalIncome = action.payload
        },
        changeUserTotalExpenses: (state, action: PayloadAction<number>) => {
            state.totalExpenses = action.payload
        },
        updateAllUserSlice: (state, action: PayloadAction<userDataType>) => {
            return {
                ...state,
                userEmail: action.payload.userEmail,
                userName: action.payload.userName,
                userUID: action.payload.userUID,
                cards: action.payload.cards,
                totalBalance: action.payload.totalBalance,
                totalIncome: action.payload.totalIncome,
                totalExpenses: action.payload.totalExpenses,
                welcomeSeen: action.payload.welcomeSeen,
                assistantEnabled: action.payload.assistantEnabled,
                avatar: action.payload.avatar,
                paymentMethods: action.payload.paymentMethods,
                notificationPrefs: action.payload.notificationPrefs,
            }
        },
        // HU14 / HU52: cambia preferencias sin esperar a recargar los datos
        setUserPreferences: (state, action: PayloadAction<Partial<Pick<userDataType, 'assistantEnabled' | 'avatar' | 'notificationPrefs'>>>) => {
            return { ...state, ...action.payload }
        }
    }
});

export const { changeUserEmail, changeUserName, changeUserUID, addUserCard, deleteUserCard, updateAllUserSlice, setUserPreferences } = userDataSlice.actions;