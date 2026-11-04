import { savingEnum, savingSliceType } from './types'

export const SAVINGS_SLICE_NAME = "savings"

export const DEFAULT_STATE_SAVINGS: savingSliceType = {
    savingsData: [
        {
            savingName: "Party",
            savingValue: 100000,
            savingColor: "#2D18BF",
            savingImage: savingEnum.fire,
            monthlySaving: 50000,
            savingActualFee: 100000,
            savingTotalFee: 600000,
            savingHistory: [
                {
                    date: new Date("2024-9-04").toISOString(),
                    deposit: 50000
                },
                {
                    date: new Date("2024-8-04").toISOString(),
                    deposit: 50000
                }
            ]
        },
        {
            savingName: "Trip",
            savingValue: 40000,
            savingColor: "#A8F25D",
            monthlySaving: 20000,
            savingActualFee: 40000,
            savingTotalFee: 480000,
            savingHistory: [
                {
                    date: new Date("2024-9-02").toISOString(),
                    deposit: 20000
                },
                {
                    date: new Date("2024-10-03").toISOString(),
                    deposit: 20000
                },
            ],
            savingImage: savingEnum.globe
        },
        {
            savingName: "Motorbike",
            savingValue: 10000,
            savingColor: "#F2622E",
            monthlySaving: 100000,
            savingActualFee: 400000,
            savingTotalFee: 1000000,
            savingHistory: [
                {
                    date: new Date("2024-8-04").toISOString(),
                    deposit: 100000
                },
            ],
            savingImage: savingEnum.key
        },
        {
            savingName: "Others",
            savingValue: 0,
            savingColor: "#C4C4C4",
            monthlySaving: 0,
            savingActualFee: 0,
            savingTotalFee: 0,
            savingHistory: [],
            savingImage: savingEnum.other
        }
    ]
}