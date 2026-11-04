import { constantsSaverLevels } from "../../utils/saverLevels"
import { rewardsSliceType, saverLevelsNames } from "./types"

export const REWARDS_SLICE_NAME = "rewards"

export const DEFAULT_STATE_REWARDS: rewardsSliceType = {
    summary: {
        saverLevel: saverLevelsNames.level1,
        goalsCompleted: 0,
        accumulatedCapypoints: 0
    },
    saverLevels: constantsSaverLevels,
    missions: [],
    exchangeData: [],
    userExpGained: 0
}