import "./ExpensesHistory.css";

import { expenseNameCategories, realExpenseType } from "../../../store/expenses/types";
import { useEffect, useState } from "react";

//Import images
import cartSvg from '../../../assets/desktop/svg/cart.svg'
import shoppingSvg from '../../../assets/desktop/svg/shopping.svg'
import homeSvg from '../../../assets/desktop/svg/home.svg'
import travelSvg from '../../../assets/desktop/svg/icons/globeBlackIcon.svg'
import outingsSvg from '../../../assets/desktop/svg/outingsSvg.svg'
import otherSvg from '../../../assets/desktop/svg/otherExpenseSvg.svg'
import familySvg from '../../../assets/desktop/svg/familySvg.svg'
import friendsSvg from '../../../assets/desktop/svg/friendsSvg.svg'
import { formatDate } from "../../../utils/timestampConvertion";

interface ExpensesHistoryProps {
  ExpenseHistoryData: realExpenseType[];
}

export const ExpensesHistory = ({ ExpenseHistoryData }: ExpensesHistoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<expenseNameCategories>(expenseNameCategories.category); // State for selected category
  const [filteredExpenses, setFilteredExpenses] = useState<realExpenseType[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as expenseNameCategories);
  };

  useEffect(() => {
    const updateFilteredIncomes = () => {
      let expensesToFilter = ExpenseHistoryData;

      if (selectedCategory !== expenseNameCategories.category) {
        expensesToFilter = ExpenseHistoryData.filter(
          (expense) => expense.expenseCategory === selectedCategory
        );
      }

      const newFilterExpenses = expensesToFilter.map((expense) => {
        const updatedExpense = { ...expense };
        switch (expense.expenseCategory) {
          case expenseNameCategories.mercado:
            updatedExpense.expenseImage = cartSvg;
            break;
          case expenseNameCategories.ropa:
            updatedExpense.expenseImage = shoppingSvg;
            break;
          case expenseNameCategories.hogar:
            updatedExpense.expenseImage = homeSvg;
            break;
          case expenseNameCategories.viajes:
            updatedExpense.expenseImage = travelSvg;
            break;
          case expenseNameCategories.Amigos:
            updatedExpense.expenseImage = friendsSvg;
            break;
          case expenseNameCategories.familia:
            updatedExpense.expenseImage = familySvg;
            break;
          case expenseNameCategories.salidas:
            updatedExpense.expenseImage = outingsSvg;
            break;
          case expenseNameCategories.otro:
            updatedExpense.expenseImage = otherSvg;
            break;
          default:

            break;
        }
        return updatedExpense;
      });

      setFilteredExpenses(newFilterExpenses);
    };

    updateFilteredIncomes();
  }, [ExpenseHistoryData, selectedCategory]);

  return (
    <div className="generalHistoryExpenses">
      <div className="topHistoryExpenses">
        <h1>History</h1>
        <select
          className="select-history-expenses"
          name="categories"
          onChange={handleChange}
          value={selectedCategory}
          required
        >
          {Object.values(expenseNameCategories).map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </div>

      <div id="expensesHistoryListContainer">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, index) => (
            <li
              className="cards-expenses-info"
              key={index}
              style={{ marginBottom: "20px", listStyleType: "none" }}
            >
              <div className="expense-content">
                <img
                  className="image-card-expenses"
                  src={expense.expenseImage}
                  alt={`Image of ${expense.expenseSite}`}
                  width={50}
                  height={50}
                />
                <div className="card-container-expense-details">
                  <div className="expense-details">
                    <h2>{expense.expenseSite}</h2>
                    <p>Category: {expense.expenseCategory}</p>
                    <p>Date: {formatDate(expense.expenseDate).toLocaleDateString()}</p>
                  </div>
                  <p className="history-expense-amount">${expense.expenseAmount}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No hay ingresos para la categoría seleccionada.</p>
        )}
      </div>
    </div >
  );
};
