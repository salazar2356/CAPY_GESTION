import { userDataType } from "./types"

export const USER_DATA_SLICE_NAME = "userData"

export const DEFAULT_STATE_USER_DATA: userDataType = {
    userEmail: "",
    userName: "",
    userUID: "",
    cards: [],
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    welcomeSeen: true
}
