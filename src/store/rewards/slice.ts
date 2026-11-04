import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//import { RootState } from "../store"; // Asegúrate de importar el tipo del estado raíz
import { REWARDS_SLICE_NAME, DEFAULT_STATE_REWARDS } from "./constants";
import { rewardsSliceType, saverLevelsNames } from "./types";
import { constantsSaverLevels } from "../../utils/saverLevels";

// export const completeMissionThunk = createAsyncThunk(
//     `${REWARDS_SLICE_NAME}/completeMission`,
//     (missionId: number, { dispatch, getState }) => {
//         const state = getState() as RootState
//         const mission = state.rewards.missions.find((mission: missionType) => mission.missionId === missionId);
//         if (mission && !mission.completed) {
//             dispatch(changeUserExpGained(mission.missionCapypoints));
//             dispatch(completeMission(missionId));
//         }
//     }
// );

// export const redeemedExchangeThunk = createAsyncThunk(
//     `${REWARDS_SLICE_NAME}/redeemedExchange`,
//     (exchangeId: number, { dispatch, getState }) => {
//         const state = getState() as RootState; // Tipar 'state' como 'RootState'
//         const exchange = state.rewards.exchangeData.find((exchange: exchangeType) => exchange.exchangeId === exchangeId);
//         if (exchange && !exchange.isRedeemed) {
//             dispatch(changeUserAccumulatedCapypoints(-exchange.redemptionCost));
//             dispatch(redeemedExchange(exchangeId));
//         }
//     }
// );

export const rewardsSlice = createSlice({
    name: REWARDS_SLICE_NAME,
    initialState: {
        ...DEFAULT_STATE_REWARDS
    } as rewardsSliceType, // Tipar el estado inicial como RewardsState
    reducers: {
        changeUserExpGained: (state, action: PayloadAction<number>) => {
            state.userExpGained += action.payload;
        },
        changeUserSaverLevel: (state, action: PayloadAction<saverLevelsNames>) => {
            state.summary.saverLevel = action.payload;
        },
        changeUserGoalsCompleted: (state, action: PayloadAction<number>) => {
            state.summary.goalsCompleted += action.payload;
        },
        changeUserAccumulatedCapypoints: (state, action: PayloadAction<number>) => {
            state.summary.accumulatedCapypoints += action.payload;
        },
        completeMission: (state, action: PayloadAction<number>) => {
            const mission = state.missions.find((mission) => mission.missionId === action.payload);
            if (mission) {
                mission.completed = true;
            }
        },
        redeemedExchange: (state, action: PayloadAction<number>) => {
            const exchange = state.exchangeData.find((exchange) => exchange.exchangeId === action.payload);
            if (exchange) {
                exchange.isRedeemed = true;
            }
        },
        updateAllRewardsSlice: (state, action: PayloadAction<rewardsSliceType>) => {
            return {
                ...state,
                summary: action.payload.summary,
                saverLevels: constantsSaverLevels,
                missions: action.payload.missions,
                exchangeData: action.payload.exchangeData,
                userExpGained: action.payload.userExpGained,
            }
        }
    }
});

export const {
    changeUserExpGained,
    changeUserSaverLevel,
    changeUserGoalsCompleted,
    changeUserAccumulatedCapypoints,
    completeMission,
    redeemedExchange,
    updateAllRewardsSlice
} = rewardsSlice.actions;
