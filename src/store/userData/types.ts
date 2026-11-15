import type { notificationPrefsType, paymentMethodType } from "../../types/firebaseUserTypes"

export interface userDataType {
    userEmail: string,
    userName: string,
    userUID: string
    cards: Array<cardType>,
    totalBalance: number,
    totalIncome: number,
    totalExpenses: number,
    welcomeSeen: boolean,
    assistantEnabled: boolean,  // HU52
    avatar: string,             // HU14
    paymentMethods: Array<paymentMethodType>,     // HU18
    notificationPrefs: notificationPrefsType      // HU56
}

export interface cardType {
    cardName: cardNamesEnum,
    cardNumber: number,
    cardMoney: number
}

export enum cardNamesEnum {
    nu = "Nu",
    visa = "Visa",
    falabella = "Falabella",
    nequi = "Nequi"
}