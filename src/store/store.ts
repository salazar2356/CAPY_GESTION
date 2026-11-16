import { combineReducers, configureStore, createSlice, type UnknownAction } from '@reduxjs/toolkit';
import { savingsSlice } from './savings/slice';
import { rewardsSlice } from './rewards/slice';
import { expensesSlice } from './expenses/slice';
import { incomesSlice } from './incomes/slice';
import { userDataSlice } from './userData/slice';

const pruebaSlice = createSlice({
    name: "global",
    initialState: {
        addSavingModal: false
    },
    reducers: {
        changeAddSavingModal: (state, action) => {
            state.addSavingModal = action.payload;
        }
    }
});

export const { changeAddSavingModal } = pruebaSlice.actions;

const appReducer = combineReducers({
        global: pruebaSlice.reducer,
        savings: savingsSlice.reducer,
        rewards: rewardsSlice.reducer,
        expenses: expensesSlice.reducer,
        incomes: incomesSlice.reducer,
        userData: userDataSlice.reducer
});

export const store = configureStore({
    reducer: (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => appReducer(action.type === 'app/reset' ? undefined : state, action)
});

// Define y exporta RootState para usar el tipo en otros archivos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export enum storeReducerNames {
    global = "global",
    savings = "savings",
    rewards = "rewards",
    expenses = "expenses",
    incomes = "incomes",
    userData = "userData"
}
