export interface incomesSliceType {
    realIncomes: Array<realIncomeType>
}

export interface realIncomeType {
    incomeCategory: incomeNameCategories,
    incomeEntrie: incomeNameEntries,
    incomeDate: string,
    incomeAmount: number,
    incomeColor: string
    incomeImage?: string
}

export enum incomeNameCategories {
    work = "Work",
    freelance = "Freelance"
}

export enum incomeNameEntries {
    cards = "Cards",
    nu = "NU",
    masterCard = "MasterCard",
    visa = "VISA",
    efectivo = "Efectivo",
    debito = "Debito",
    otro = "Otro"
}