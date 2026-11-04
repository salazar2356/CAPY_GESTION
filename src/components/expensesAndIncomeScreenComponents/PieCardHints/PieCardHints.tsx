import { expenseNameCategories } from '../../../store/expenses/types';
import { incomeNameEntries } from '../../../store/incomes/types';
import './PieCardHints.css';

interface objectExpense {
    fill: string;
    expenseCategoryName: expenseNameCategories;
    expenseCategoryValue: number;
    expensePercentage: number;
}

interface objectIncome {
    incomeCategoryName: incomeNameEntries;
    incomeCategoryValue: number;
    fill: string;
    incomePercentage: number;
}

interface categoryArrayMonthExpense {
    expenseCategoryName: string;
    fill: string;
    expensePercentage: number;
}

interface categoryArrayMonthIncome {
    incomeEntryName: string;
    fill: string;
    incomePercentage: number;
    value: number;
}

interface PieCardHintsProps {
    categoryArrayTotal: Array<objectExpense> | Array<objectIncome>;
    isMonthData: boolean;
    categoryArrayMonth: Array<categoryArrayMonthExpense> | Array<categoryArrayMonthIncome>;
}

export const PieCardHints = ({ categoryArrayTotal, isMonthData, categoryArrayMonth }: PieCardHintsProps) => {
    if (isMonthData) {
        return (
            <ul className="container-info-pie-chart">
                {categoryArrayMonth.map((categoryItem) => {
                    const isExpenseCategory = 'expenseCategoryName' in categoryItem;

                    return (
                        <li
                            key={
                                isExpenseCategory
                                    ? categoryItem.expenseCategoryName
                                    : categoryItem.incomeEntryName
                            }
                            className="info-pie-chart-color"
                        >
                            <div className="hint">
                                <div
                                    className="color"
                                    style={{ backgroundColor: categoryItem.fill }}
                                ></div>
                                <p>
                                    {isExpenseCategory
                                        ? categoryItem.expenseCategoryName
                                        : categoryItem.incomeEntryName}
                                </p>
                                <p>
                                    {isExpenseCategory
                                        ? categoryItem.expensePercentage.toFixed(2)
                                        : categoryItem.incomePercentage.toFixed(2)}
                                    %
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    } else {
        return (
            <ul className="container-info-pie-chart">
                {categoryArrayTotal.map((categoryItem) => {
                    const isExpense = 'expenseCategoryName' in categoryItem;

                    return (
                        <li
                            key={
                                isExpense
                                    ? categoryItem.expenseCategoryName
                                    : categoryItem.incomeCategoryName
                            }
                            className="info-pie-chart-color"
                        >
                            <div className="hint">
                                <div
                                    className="color"
                                    style={{ backgroundColor: categoryItem.fill }}
                                ></div>
                                <p>
                                    {isExpense
                                        ? categoryItem.expenseCategoryName
                                        : categoryItem.incomeCategoryName}
                                </p>
                                <p>
                                    {(isExpense
                                        ? categoryItem.expensePercentage
                                        : categoryItem.incomePercentage
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
};
