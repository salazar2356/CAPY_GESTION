export interface rewardsSliceType {
    summary: summaryType,
    saverLevels: Array<saverLevelType>,
    missions: Array<missionType>
    exchangeData: Array<exchangeType>,
    userExpGained: number
}

export interface summaryType {
    saverLevel: saverLevelsNames,
    goalsCompleted: number,
    accumulatedCapypoints: number
}

export interface saverLevelType {
    name: saverLevelsNames,
    image: saverLevelsImages,
    expNecesary: number
}

export enum saverLevelsNames {
    level1 = "Saver Novice",
    level2 = "Budget Beginner",
    level3 = "Thrifty Trainee",
    level4 = "Clever Planner",
    level5 = "Frugal Financier",
    level6 = "Smart Investor",
    level7 = "Savings Strategist",
    level8 = "Financial Guide",
    level9 = "Wealth Architect",
    level10 = "Master of Savings"
}

export enum saverLevelsImages {
    bronzeImage = "bronze",
    silverImage = "silver",
    goldImage = "gold",
    diamondImage = "diamond",
    lunarImage = "lunar",
    maxImage = "max"
}

export interface missionType {
    missionName: string,
    missionDescription: string,
    missionColor: string,
    missionCapypoints: number,
    completed: boolean,
    missionId: number,
    missionExp: number
}

export interface exchangeType {
    name: exchangeNameEnum,
    redemptionCapypointsAmount: number,
    redemptionCost: number,
    isRedeemed: boolean,
    exchangeId: number,
    // imageSrc: string,
    backgroundColor: string,
    darkText: boolean
}

export enum exchangeNameEnum {
    amazon = "Amazon",
    netflix = "Netflix",
    farmatodo = "Farmatodo"
}