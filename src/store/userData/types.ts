export interface userDataType {
    userEmail: string,
    userName: string,
    userUID: string
    cards: Array<cardType>,
    totalBalance: number,
    totalIncome: number,
    totalExpenses: number
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