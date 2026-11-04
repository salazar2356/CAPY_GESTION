export interface savingType {
    savingName: string,
    savingValue: number,
    savingColor: string,
    // savingPercentage: string,
    savingImage: savingEnum,
    monthlySaving: number,
    savingActualFee: number,
    savingTotalFee: number,
    savingHistory: Array<savingHistoryType>
}

export interface savingHistoryType {
    date: string,
    deposit: number
}

export interface savingSliceType {
    savingsData: Array<savingType>
}

export enum savingEnum {
    globe = "globe",
    key = "key",
    fire = "fire",
    other = "other"
}