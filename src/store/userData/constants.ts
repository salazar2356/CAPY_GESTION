import { cardNamesEnum, userDataType } from "./types"

export const USER_DATA_SLICE_NAME = "userData"

export const DEFAULT_STATE_USER_DATA: userDataType = {
    userEmail: "",
    userName: "",
    userUID: "",
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
        },
        {
            cardName: cardNamesEnum.falabella,
            cardNumber: 2351,
            cardMoney: 86500
        },
    ],
    totalBalance: 0,
    totalIncome: 600000,
    totalExpenses: 0
}