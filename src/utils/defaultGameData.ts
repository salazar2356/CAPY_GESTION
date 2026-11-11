import { exchangeNameEnum, exchangeType, missionType } from "../store/rewards/types";
import { savingType } from "../store/savings/types";
import { realExpenseType, plannedExpenseType } from "../store/expenses/types";
import { realIncomeType } from "../store/incomes/types";

// Misiones que recibe todo usuario nuevo. Cada una se verifica con una condición real (ver missionConditions)
export const DEFAULT_MISSIONS: Array<missionType> = [
    {
        missionId: 0,
        missionName: "First goal",
        missionDescription: "Create your first savings goal.",
        missionColor: "#2D18BF",
        missionCapypoints: 100,
        missionExp: 150,
        completed: false
    },
    {
        missionId: 1,
        missionName: "First income",
        missionDescription: "Register your first income.",
        missionColor: "#F2622E",
        missionCapypoints: 100,
        missionExp: 150,
        completed: false
    },
    {
        missionId: 2,
        missionName: "Plan ahead",
        missionDescription: "Add a planned expense to your monthly planner.",
        missionColor: "#A8F25D",
        missionCapypoints: 150,
        missionExp: 200,
        completed: false
    },
    {
        missionId: 3,
        missionName: "Keep saving",
        missionDescription: "Make a deposit to one of your savings goals.",
        missionColor: "#2D18BF",
        missionCapypoints: 200,
        missionExp: 250,
        completed: false
    }
]

// Recompensas canjeables que recibe todo usuario nuevo
export const DEFAULT_EXCHANGES: Array<exchangeType> = [
    {
        exchangeId: 0,
        name: exchangeNameEnum.farmatodo,
        redemptionCapypointsAmount: 300,
        redemptionCost: 5000,
        isRedeemed: false,
        backgroundColor: "#A8F25D",
        darkText: true
    },
    {
        exchangeId: 1,
        name: exchangeNameEnum.netflix,
        redemptionCapypointsAmount: 500,
        redemptionCost: 25000,
        isRedeemed: false,
        backgroundColor: "#F2622E",
        darkText: false
    },
    {
        exchangeId: 2,
        name: exchangeNameEnum.amazon,
        redemptionCapypointsAmount: 800,
        redemptionCost: 40000,
        isRedeemed: false,
        backgroundColor: "#4A00E0",
        darkText: false
    }
]

export interface missionContext {
    savings: Array<savingType>,
    incomes: Array<realIncomeType>,
    plannedExpenses: Array<plannedExpenseType>,
    realExpenses: Array<realExpenseType>
}

// Condición que debe cumplir el usuario para poder completar cada misión
export const missionConditions: Record<number, (ctx: missionContext) => boolean> = {
    0: (ctx) => ctx.savings.length > 0,
    1: (ctx) => ctx.incomes.length > 0,
    2: (ctx) => ctx.plannedExpenses.length > 0,
    3: (ctx) => ctx.savings.some((saving) => saving.savingHistory.length > 0)
}
