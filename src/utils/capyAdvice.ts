import { realExpenseType, plannedExpenseType } from "../store/expenses/types";
import { realIncomeType } from "../store/incomes/types";
import { savingType } from "../store/savings/types";

export interface capyAdviceContext {
    realExpenses: Array<realExpenseType>,
    plannedExpenses: Array<plannedExpenseType>,
    realIncomes: Array<realIncomeType>,
    savings: Array<savingType>
}

const money = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`

const isCurrentMonth = (isoDate: string) => {
    const date = new Date(isoDate)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

// Gasto del mes actual por categoría
export const getMonthExpensesByCategory = (expenses: Array<realExpenseType>) => {
    const byCategory: Record<string, number> = {}
    expenses.filter((e) => isCurrentMonth(e.expenseDate)).forEach((e) => {
        byCategory[e.expenseCategory] = (byCategory[e.expenseCategory] || 0) + e.expenseAmount
    })
    return byCategory
}

// HU53: consejo según los gastos del usuario
export const getSpendingAdvice = (ctx: capyAdviceContext): string => {
    const byCategory = getMonthExpensesByCategory(ctx.realExpenses)
    const categories = Object.keys(byCategory)
    const totalSpent = categories.reduce((acc, c) => acc + byCategory[c], 0)

    if (categories.length === 0) {
        return "I don't have expenses from this month yet. Register what you spend in Expenses & Income and I will analyze it for you."
    }

    // 1. Presupuestos excedidos o casi agotados
    const budgetByCategory: Record<string, number> = {}
    ctx.plannedExpenses.forEach((p) => {
        budgetByCategory[p.expenseCategory] = (budgetByCategory[p.expenseCategory] || 0) + p.expenseAmount
    })

    for (const category of categories) {
        const budget = budgetByCategory[category]
        if (budget && byCategory[category] > budget) {
            return `Careful! You already spent ${money(byCategory[category])} on "${category}", which is ${money(byCategory[category] - budget)} over your budget of ${money(budget)}. Try to pause spending in that category until next month.`
        }
    }
    for (const category of categories) {
        const budget = budgetByCategory[category]
        if (budget && byCategory[category] >= budget * 0.8) {
            const percentage = Math.round((byCategory[category] / budget) * 100)
            return `You have used ${percentage}% of your "${category}" budget (${money(byCategory[category])} of ${money(budget)}). Slow down a little to finish the month within your plan.`
        }
    }

    // 2. Gastos vs ingresos del mes
    const monthIncome = ctx.realIncomes
        .filter((i) => isCurrentMonth(i.incomeDate))
        .reduce((acc, i) => acc + i.incomeAmount, 0)
    if (monthIncome > 0 && totalSpent > monthIncome) {
        return `This month you have spent ${money(totalSpent)} and earned ${money(monthIncome)}. You are spending more than you earn, so review your biggest categories and cut what is not essential.`
    }

    // 3. Categoría que más pesa
    const topCategory = categories.sort((a, b) => byCategory[b] - byCategory[a])[0]
    const share = Math.round((byCategory[topCategory] / totalSpent) * 100)
    if (share >= 40 && categories.length > 1) {
        return `"${topCategory}" is ${share}% of your spending this month (${money(byCategory[topCategory])}). Setting a monthly budget for it in the planner can help you control it.`
    }

    if (monthIncome > 0) {
        const savedShare = Math.round(((monthIncome - totalSpent) / monthIncome) * 100)
        return `Nice work! You have spent ${money(totalSpent)} of ${money(monthIncome)} this month, so you are keeping ${savedShare}% of your income. Consider moving part of it to a savings goal.`
    }

    return `You have spent ${money(totalSpent)} this month and your biggest category is "${topCategory}". Register your incomes too so I can tell you how much you are keeping.`
}

// HU54: mensaje de motivación sobre las metas de ahorro
export const getGoalMotivation = (ctx: capyAdviceContext): string => {
    const goals = ctx.savings

    if (goals.length === 0) {
        return "You don't have a savings goal yet. Create your first one in Savings: even a small goal is a great start!"
    }

    const withProgress = goals
        .filter((g) => g.savingTotalFee > 0)
        .map((g) => ({ goal: g, percentage: (g.savingActualFee / g.savingTotalFee) * 100 }))

    const completed = withProgress.filter((g) => g.percentage >= 100)
    const inProgress = withProgress.filter((g) => g.percentage < 100)

    if (inProgress.length === 0 && completed.length > 0) {
        return `Amazing! You completed ${completed.length === 1 ? `your goal "${completed[0].goal.savingName}"` : `all your ${completed.length} goals`}. Why not set a new, bigger goal?`
    }

    const closest = inProgress.sort((a, b) => b.percentage - a.percentage)[0]
    const remaining = closest.goal.savingTotalFee - closest.goal.savingActualFee

    if (closest.goal.savingActualFee === 0) {
        return `Your goal "${closest.goal.savingName}" is waiting for its first deposit. Start with ${money(closest.goal.monthlySaving || closest.goal.savingTotalFee * 0.1)} today and you will be on your way!`
    }

    const months = closest.goal.monthlySaving > 0 ? Math.ceil(remaining / closest.goal.monthlySaving) : null
    const monthsText = months ? ` At ${money(closest.goal.monthlySaving)} per month you will get there in about ${months} month${months === 1 ? '' : 's'}.` : ''

    if (closest.percentage >= 75) {
        return `So close! "${closest.goal.savingName}" is ${Math.round(closest.percentage)}% done and only ${money(remaining)} are left.${monthsText}`
    }
    if (closest.percentage >= 40) {
        return `Great progress! You already saved ${Math.round(closest.percentage)}% of "${closest.goal.savingName}". Keep going, ${money(remaining)} to go.${monthsText}`
    }
    return `You have started "${closest.goal.savingName}" and saved ${money(closest.goal.savingActualFee)}. Every deposit counts, keep it up!${monthsText}`
}
