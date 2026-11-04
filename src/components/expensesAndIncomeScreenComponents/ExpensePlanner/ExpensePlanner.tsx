import './ExpensePlanner.css';

import { useContext, useEffect, useState } from 'react';

//  Import Incomes Images
import PlannerIcon from "../../../../src/assets/desktop/svg/PlannerIcon.svg";

//  Import Expenses Images
import cartSvg from '../../../assets/desktop/svg/cart.svg'
import shoppingSvg from '../../../assets/desktop/svg/shopping.svg'
import homeSvg from '../../../assets/desktop/svg/home.svg'
import travelSvg from '../../../assets/desktop/svg/globeIconWhite.svg'
import outingsSvg from '../../../assets/desktop/svg/outingsSvg.svg'
import otherExpenseSvg from '../../../assets/desktop/svg/otherExpenseSvg.svg'
import familySvg from '../../../assets/desktop/svg/familySvg.svg'
import friendsSvg from '../../../assets/desktop/svg/friendsSvg.svg'

//  Import Incomes Images
import nuSvg from '../../../assets/desktop/svg/nuSvg.svg';
import masterCardSvg from '../../../assets/desktop/svg/mastercardSvg.svg';
import visaSvg from '../../../assets/desktop/svg/visaSvg.svg';
import efectivoSvg from '../../../assets/desktop/svg/efectivoSvg.svg';
import debitoSvg from '../../../assets/desktop/svg/debitoSvg.svg';
import otroCardSvg from '../../../assets/desktop/svg/otroSvg.svg';
import { incomeNameEntries } from '../../../store/incomes/types';
import { expenseNameCategories, plannedExpenseType } from '../../../store/expenses/types';
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext';
import { CreatePlannedExpense } from '../../../services/Firebase/FirestoreUsers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { convertISOStringToTimestamp } from '../../../utils/timestampConvertion';

interface ExpensePlannerProps {
  ExpensePlannerData: plannedExpenseType[]
}

export const ExpensePlanner = ({ ExpensePlannerData }: ExpensePlannerProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState<incomeNameEntries>(incomeNameEntries.cards);
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState<expenseNameCategories>(expenseNameCategories.category);
  const [site, setSite] = useState<string>("");
  // const [entrie, setEntrie] = useState<incomeNameEntries>(incomeNameEntries.otro);
  const [plannedExpenses, setPlannedExpenses] = useState<plannedExpenseType[]>(ExpensePlannerData);

  const allPlannedExpenses = useSelector((state: RootState) => state.expenses.plannedExpenses);

  const OnChangeFirebase = useContext(ChangeFirebaseContext)

  useEffect(() => {
    setPlannedExpenses(ExpensePlannerData)
  }, [ExpensePlannerData])

  const togglePopUp = () => {
    setShowPopup(!showPopup);
    if (showPopup) {
      setSelectedCard(incomeNameEntries.cards);
      setBudget("");
      setCategory(expenseNameCategories.category);
    }
  };

  const handleAddExpense = () => {
    if (selectedCard && budget && category) {

      const convertionOfPlannedExpensesToTimestamp = allPlannedExpenses.map((plannedExpense) => ({
        ...plannedExpense,
        expenseDate: convertISOStringToTimestamp(plannedExpense.expenseDate)
      }))

      CreatePlannedExpense(OnChangeFirebase.logedUserUID, category, site, parseInt(budget), selectedCard, convertionOfPlannedExpensesToTimestamp, OnChangeFirebase.fetchAndSetUserData)
      setShowPopup(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  const iconMap: Record<string, string> = {
    [incomeNameEntries.nu]: nuSvg,
    [incomeNameEntries.visa]: visaSvg,
    [incomeNameEntries.masterCard]: masterCardSvg,
    [incomeNameEntries.efectivo]: efectivoSvg,
    [incomeNameEntries.debito]: debitoSvg,
    [incomeNameEntries.otro]: otroCardSvg,
  };

  const cardIcons: Record<string, string> = Object.values(incomeNameEntries).reduce((acc, value) => {
    if (iconMap[value]) {
      acc[value] = iconMap[value];
    }
    return acc;
  }, {} as Record<string, string>);

  const expenseIconMap: Partial<Record<expenseNameCategories, string>> = {
    [expenseNameCategories.hogar]: homeSvg,
    [expenseNameCategories.mercado]: cartSvg,
    [expenseNameCategories.ropa]: shoppingSvg,
    [expenseNameCategories.salidas]: outingsSvg,
    [expenseNameCategories.viajes]: travelSvg,
    [expenseNameCategories.familia]: familySvg,
    [expenseNameCategories.Amigos]: friendsSvg,
    [expenseNameCategories.otro]: otherExpenseSvg,
  };

  const categoryIcons: Record<string, string> = Object.values(expenseNameCategories).reduce((acc, value) => {
    if (expenseIconMap[value as expenseNameCategories]) {
      acc[value] = expenseIconMap[value as expenseNameCategories]!;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className='planner'>
      <h2>Monthly Expense Planner</h2>

      {plannedExpenses.length === 0 ? (
        <>
          <img className="PlannerIcon" src={PlannerIcon} alt="PlannerIcon" />
          <h3>You don't have budgeted expenses</h3>
        </>
      ) : (
        <div className="expense-list">
          {plannedExpenses.map((expense, index) => {
            const cardIconSrc = cardIcons[expense.expenseEntrie]
            const categoryIconSrc = categoryIcons[expense.expenseCategory]
            return (
              <div key={index} className="expense-item">
                <img src={cardIconSrc} alt={expense.expenseCategory} className="card-icon" />
                <div className="expense-info">
                  <p><span>Budget:</span> ${expense.expenseAmount}</p>
                  <div className="category-info">
                    <img src={categoryIconSrc} alt={expense.expenseCategory} className="category-icon" />
                    <p>{expense.expenseCategory}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="add" onClick={togglePopUp}>Add a new expense</button>

      {showPopup && (
        <>
          <div className='popup'>
            <p className='title'>New Expense</p>
            <h3>Cards</h3>
            <select name="cards" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value as incomeNameEntries)} required>
              {Object.values(incomeNameEntries).map((entryName) => (
                <option key={entryName} value={entryName}>
                  {entryName}
                </option>
              ))}
            </select>

            <h3>Budget</h3>
            <input
              className='budget'
              type='number'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter amount"
            />

            <h3>Expense Site</h3>
            <input
              className='budget'
              type='text'
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="Enter expense site"
            />

            {/* <h3>Expense Entrie</h3>
            <select
              className='budget'
              name="categories"
              onChange={() => { setEntrie(entrie) }}
              required
            >
              {Object.values(incomeNameEntries).map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select> */}

            <h3>Categories</h3>
            <select name="categories" value={category} onChange={(e) => setCategory(e.target.value as expenseNameCategories)} required>
              {Object.values(expenseNameCategories).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>

            <div className="button-container">
              <button className="close-button" onClick={togglePopUp}>Cancel</button>
              <button className="add-button" onClick={handleAddExpense}>Add  expense</button>
            </div>
          </div>

          <div id='backgroundPopUpAddExpense'>

          </div>
        </>
      )}
    </div>
  );
};