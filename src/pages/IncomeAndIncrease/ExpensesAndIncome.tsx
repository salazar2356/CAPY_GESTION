import "./ExpensesAndIncome.css";

import { ExpensesGraphic } from "../../components/expensesAndIncomeScreenComponents/ExpensesGraphic/ExpensesGraphic";
import { IncomeData, IncomesGraphic } from "../../components/expensesAndIncomeScreenComponents/IncomesGraphic/IncomesGraphic";
import { ExpensePlanner } from "../../components/expensesAndIncomeScreenComponents/ExpensePlanner/ExpensePlanner";
import { ExpensesHistory } from "../../components/expensesAndIncomeScreenComponents/ExpensesHistory/ExpensesHistory";
import { ExpensesPieChart } from "../../components/expensesAndIncomeScreenComponents/ExpensesPieChart/ExpensesPieChart";
import { IncomeHistory } from "../../components/expensesAndIncomeScreenComponents/IncomeHistory/IncomeHistory";
import { ExpenseData } from "../../components/expensesAndIncomeScreenComponents/ExpensesGraphic/ExpensesGraphic";
import { useState, useEffect } from "react";
import { GlobalAppNav } from "../../components/Nav/Nav";
import { PieCardMonthSelect } from "../../components/expensesAndIncomeScreenComponents/PieCardMonthSelect/PieCardMonthSelect";
import { PieCardHints } from "../../components/expensesAndIncomeScreenComponents/PieCardHints/PieCardHints";
import { IncomesPieChart } from "../../components/expensesAndIncomeScreenComponents/IncomesPieChart/IncomesPieChart";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { incomeNameEntries, realIncomeType } from "../../store/incomes/types";
import { expenseNameCategories, realExpenseType } from "../../store/expenses/types";
import { formatDate } from "../../utils/timestampConvertion";
import { useUserFirebaseData } from "../../hooks/useUserFirebaseData";
import { NavigationHook } from "../../hooks/navigationHook";
import { ChangeFirebaseContext } from "../../Contexts/changeFirebaseContext";
import { CapyAssistant } from "../../components/capyAssistantComponent/capyAssistantComponent";

function getMonthName(date: Date): string {
  return date.toLocaleString("en-US", { month: "long" });
}

function calculateExpensesData(expenses: Array<realExpenseType>) {
  const monthlyExpenseData: {
    [month: string]: {
      totalAmount: number;
      categoryAmounts: { [key: string]: { amount: number; fill: string } };
      value: number;
    };
  } = {};

  expenses.forEach((expense) => {
    // Convertir expenseDate de Timestamp a Date
    const month = getMonthName(formatDate(expense.expenseDate));

    // Inicializar el objeto del mes si no existe
    if (!monthlyExpenseData[month]) {
      monthlyExpenseData[month] = { totalAmount: 0, categoryAmounts: {}, value: 0 };
    }

    // Actualizar el totalAmount del mes
    monthlyExpenseData[month].totalAmount += expense.expenseAmount;

    // Verificar si la categoría específica ya existe en categoryAmounts
    if (!monthlyExpenseData[month].categoryAmounts[expense.expenseCategory]) {
      monthlyExpenseData[month].categoryAmounts[expense.expenseCategory] = {
        amount: 0,
        fill: expense.expenseColor
      };
    }

    // Sumar el monto a la categoría correspondiente
    monthlyExpenseData[month].categoryAmounts[expense.expenseCategory].amount +=
      expense.expenseAmount;

    // Actualizar el valor total del mes si es necesario
    monthlyExpenseData[month].value += expense.expenseAmount;
  });

  const result = Object.keys(monthlyExpenseData).map((month) => {
    const monthData = monthlyExpenseData[month];
    const categoryPercentages = Object.keys(monthData.categoryAmounts).map(
      (category) => {
        const categoryAmount = monthData.categoryAmounts[category];
        const percentage = (categoryAmount.amount / monthData.totalAmount) * 100;
        return {
          expenseCategoryName: category, // Cambia "category" a "expenseCategoryName"
          fill: categoryAmount.fill,
          expensePercentage: parseFloat(percentage.toFixed(2)), // Cambia "percentage" a "expensePercentage"
          value: categoryAmount.amount
        };
      }
    );

    return {
      month,
      totalAmount: monthData.totalAmount,
      categoryPercentages,
    };
  });

  return result;
}

function calculateIncomesData(incomes: Array<realIncomeType>) {
  const monthlyIncomeData: {
    [month: string]: {
      totalAmount: number;
      entryAmounts: { [key: string]: { amount: number; fill: string } };
      value: number;
    };
  } = {};

  incomes.forEach((income) => {
    // Convertir incomeDate de Timestamp a Date
    const month = getMonthName(formatDate(income.incomeDate));

    // Inicializar el objeto del mes si no existe
    if (!monthlyIncomeData[month]) {
      monthlyIncomeData[month] = { totalAmount: 0, entryAmounts: {}, value: 0 };
    }

    // Actualizar el totalAmount del mes
    monthlyIncomeData[month].totalAmount += income.incomeAmount;

    // Verificar si la entrada específica ya existe en entryAmounts
    if (!monthlyIncomeData[month].entryAmounts[income.incomeEntrie]) {
      monthlyIncomeData[month].entryAmounts[income.incomeEntrie] = {
        amount: 0,
        fill: income.incomeColor,
      };
    }

    // Sumar el monto a la entrada correspondiente
    monthlyIncomeData[month].entryAmounts[income.incomeEntrie].amount +=
      income.incomeAmount;

    // Actualizar el valor total del mes si es necesario
    monthlyIncomeData[month].value += income.incomeAmount;
  });

  const result = Object.keys(monthlyIncomeData).map((month) => {
    const monthData = monthlyIncomeData[month];
    const entryPercentages = Object.keys(monthData.entryAmounts).map(
      (entry) => {
        const entryAmount = monthData.entryAmounts[entry];
        const percentage = (entryAmount.amount / monthData.totalAmount) * 100;
        return {
          incomeEntryName: entry, // Cambia "entry" a "incomeEntryName"
          fill: entryAmount.fill,
          incomePercentage: parseFloat(percentage.toFixed(2)), // Cambia "percentage" a "incomePercentage"
          value: entryAmount.amount,
        };
      }
    );

    return {
      month,
      totalAmount: monthData.totalAmount,
      entryPercentages,
    };
  });

  return result;
}

export interface expenseCategoryType {
  totalCategoryExpenses: number,
  categoryMappedData: Array<{
    expenseCategoryName: expenseNameCategories,
    expenseCategoryValue: number,
    fill: string,
    expensePercentage: number
  }>
}

export interface incomesCategoryType {
  totalCategoryIncomes: number,
  categoryMappedData: Array<{
    incomeCategoryName: incomeNameEntries,
    incomeCategoryValue: number,
    fill: string,
    incomePercentage: number
  }>
}

enum monthsSelectorNames {
  total = "Total",
  january = "January",
  february = "February",
  march = "March",
  april = "April",
  may = "May",
  june = "June",
  july = "July",
  august = "August",
  september = "September",
  october = "October",
  november = "November",
  december = "December"
}

const calculateTotalExpensesCategorty = (realExpensesData: Array<realExpenseType>) => {
  const categoryExpensesData: expenseCategoryType = {
    totalCategoryExpenses: 0,
    categoryMappedData: []
  }

  //Calculate totalCategoryExpenses
  realExpensesData.forEach((expenseItem) => {
    categoryExpensesData.totalCategoryExpenses += expenseItem.expenseAmount
  })

  //Calculate each category expenses amount
  realExpensesData.forEach((expenseItem) => {
    const foundCategoryExpensed = categoryExpensesData.categoryMappedData.find(categoryMapped => categoryMapped.expenseCategoryName === expenseItem.expenseCategory)
    if (!foundCategoryExpensed) {
      categoryExpensesData.categoryMappedData.push({
        expenseCategoryName: expenseItem.expenseCategory,
        expenseCategoryValue: expenseItem.expenseAmount,
        fill: expenseItem.expenseColor,
        expensePercentage: 0
      })
    } else {
      categoryExpensesData.categoryMappedData[categoryExpensesData.categoryMappedData.indexOf(foundCategoryExpensed)].expenseCategoryValue += expenseItem.expenseAmount
    }
  });

  //Calculates each category expenses percetage of the total
  categoryExpensesData.categoryMappedData.forEach((categoryMappedExpense) => {
    categoryMappedExpense.expensePercentage = (100 * categoryMappedExpense.expenseCategoryValue) / categoryExpensesData.totalCategoryExpenses
  })

  return categoryExpensesData
}

const calculateTotalIncomesCategorty = (realIncomesData: Array<realIncomeType>) => {
  const categoryExpensesData: incomesCategoryType = {
    totalCategoryIncomes: 0,
    categoryMappedData: []
  }

  //Calculate totalCategoryIncomes
  realIncomesData.forEach((incomesItem) => {
    categoryExpensesData.totalCategoryIncomes += incomesItem.incomeAmount
  })

  //Calculate each category expenses amount
  realIncomesData.forEach((incomesItem) => {
    const foundCategoryExpensed = categoryExpensesData.categoryMappedData.find(categoryMapped => categoryMapped.incomeCategoryName === incomesItem.incomeEntrie)
    if (!foundCategoryExpensed) {
      categoryExpensesData.categoryMappedData.push({
        incomeCategoryName: incomesItem.incomeEntrie,
        incomeCategoryValue: incomesItem.incomeAmount,
        fill: incomesItem.incomeColor,
        incomePercentage: 0
      })
    } else {
      categoryExpensesData.categoryMappedData[categoryExpensesData.categoryMappedData.indexOf(foundCategoryExpensed)].incomeCategoryValue += incomesItem.incomeAmount
    }
  });

  //Calculates each category expenses percetage of the total
  categoryExpensesData.categoryMappedData.forEach((categoryMappedIncomes) => {
    categoryMappedIncomes.incomePercentage = (100 * categoryMappedIncomes.incomeCategoryValue) / categoryExpensesData.totalCategoryIncomes
  })

  return categoryExpensesData
}

export type expenseDataResultsType = Array<ExpenseData>

export type incomeDataResultsType = Array<IncomeData>

export const ExpensesAndIncomePage = () => {
  const [selectedOption, setSelectedOption] = useState("Gastos");
  const [expenseResults, setExpenseResults] = useState<expenseDataResultsType>([]);
  const [incomeResults, setIncomeResults] = useState<incomeDataResultsType>([]);

  const [totalExpenseCategory, setTotalExpenseCategory] = useState<expenseCategoryType>({ totalCategoryExpenses: 0, categoryMappedData: [] })
  const [totalIncomesCategory, setTotalIncomesCategory] = useState<incomesCategoryType>({ totalCategoryIncomes: 0, categoryMappedData: [] })

  const [monthSelector, setMonthSelector] = useState("Total")

  //Custom hook getFirebaseData

  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStorageUserUID] = useState(() => sessionStorage.getItem('userUID'));
  const { fetchAndSetUserData } = useUserFirebaseData(sessionStorageUserUID);
  const { handleNavigation } = NavigationHook();

  useEffect(() => {
    if (!isInitialized) {
      if (!sessionStorageUserUID) {
        handleNavigation.navigateToLogin();
      } else {
        fetchAndSetUserData();
      }
      setIsInitialized(true);
    }
  }, [isInitialized, handleNavigation, sessionStorageUserUID, fetchAndSetUserData]);

  //End Custom hook getFirebaseData

  //redux
  const incomesReduxData = useSelector((state: RootState) => state.incomes)

  const expensesReduxData = useSelector((state: RootState) => state.expenses)
  //redux

  useEffect(() => {
    const expenseResults = calculateExpensesData(expensesReduxData.realExpenses);
    setExpenseResults(expenseResults);

    const incomeResults = calculateIncomesData(incomesReduxData.realIncomes);
    setIncomeResults(incomeResults);

    const totalExpensesCategoryResult = calculateTotalExpensesCategorty(expensesReduxData.realExpenses)
    setTotalExpenseCategory(totalExpensesCategoryResult)

    const totalIncomesCategoryResult = calculateTotalIncomesCategorty(incomesReduxData.realIncomes)
    setTotalIncomesCategory(totalIncomesCategoryResult)
  }, [expensesReduxData.realExpenses, incomesReduxData.realIncomes, monthSelector]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthSelector("Total")
    setSelectedOption(event.target.value);
  };

  const handleMonthSelectorChannge = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthSelector(event.target.value);
  };

  const mappedExpensesGraphicData = expenseResults.map((result) => ({
    month: result.month,
    totalAmount: result.totalAmount,
    categoryPercentages: result.categoryPercentages.map(
      (category) => ({
        expenseCategoryName: category.expenseCategoryName,
        fill: category.fill,
        expensePercentage: category.expensePercentage
      })
    ),
  }));

  const mappedIncomeResults = incomeResults.map((result) => ({
    month: result.month,
    totalAmount: result.totalAmount,
  }));

  const foundMonthData = expenseResults.find(expenseMonth => expenseMonth.month === monthSelector)
  const foundIncomeMonthData = incomeResults.find(incomeMonth => incomeMonth.month === monthSelector)

  //Expenses or Incomes Conditional
  if (selectedOption === "Gastos") {
    if (sessionStorageUserUID) {
      switch (monthSelector) {
        case monthsSelectorNames.total:
          return <>
            <ChangeFirebaseContext.Provider value={{
              setIsInitialized: setIsInitialized,
              fetchAndSetUserData: fetchAndSetUserData,
              logedUserUID: sessionStorageUserUID
            }}>
              <main className="page" id="expensesAndIncomePage">
                <h1 id="expensesAndIncomePageTitle">Expenses & Income</h1>

                <GlobalAppNav></GlobalAppNav>

                <div className="container">
                  <div className="main-div">
                    <select
                      className="select-expenses-graphic"
                      name=""
                      id=""
                      onChange={handleSelectChange}
                    >
                      <option value="Gastos">Expenses</option>
                      <option value="Ingresos">Income</option>
                    </select>
                    <div className="expense-graphic-top">
                      <div className="expense-graphic expense-graphic-color1" >
                        <ExpensesGraphic data={mappedExpensesGraphicData} />
                      </div>
                      <div className="piechart-graphic">
                        <div className="pie-card-right">
                          {/* Aqui va el select y los hints */}
                          <PieCardMonthSelect monthsArray={expenseResults.map((expense) => expense.month)} handleMonthSelectorChannge={handleMonthSelectorChannge}></PieCardMonthSelect>
                          <PieCardHints categoryArrayTotal={totalExpenseCategory.categoryMappedData} isMonthData={false} categoryArrayMonth={[]}></PieCardHints>
                        </div>
                        <ExpensesPieChart data={totalExpenseCategory} isMonthData={false} monthData={{ month: "", totalAmount: 0, categoryPercentages: [] }} />
                      </div>
                    </div>
                  </div>

                  <div className="chart-expense-bottom">
                    <div className="left-div">
                      <ExpensePlanner ExpensePlannerData={expensesReduxData.plannedExpenses} />
                    </div>
                    <div className="right-div">
                      <ExpensesHistory ExpenseHistoryData={expensesReduxData.realExpenses} />
                    </div>
                  </div>
                </div>

                <div id="backgroundExpensesAndIncomes" className="backgroundPage">

                </div>
              </main >
              <CapyAssistant />
            </ChangeFirebaseContext.Provider>
          </>

        default:
          if (foundMonthData) {
            return <>
              <ChangeFirebaseContext.Provider value={{
                setIsInitialized: setIsInitialized,
                fetchAndSetUserData: fetchAndSetUserData,
                logedUserUID: sessionStorageUserUID
              }}>


                <main className="page" id="expensesAndIncomePage">
                  <h1 id="expensesAndIncomePageTitle">Expenses & Income</h1>

                  <GlobalAppNav></GlobalAppNav>

                  <div className="container">
                    <div className="main-div">
                      <select
                        className="select-expenses-graphic"
                        name=""
                        id=""
                        onChange={handleSelectChange}
                      >
                        <option value="Gastos">Expenses</option>
                        <option value="Ingresos">Income</option>
                      </select>
                      <div className="expense-graphic-top">
                        <div className="expense-graphic expense-graphic-color1" >
                          <ExpensesGraphic data={mappedExpensesGraphicData} />
                        </div>
                        <div className="piechart-graphic">
                          <div className="pie-card-right">
                            {/* Aqui va el select y los hints */}
                            <PieCardMonthSelect monthsArray={expenseResults.map((expense) => expense.month)} handleMonthSelectorChannge={handleMonthSelectorChannge}></PieCardMonthSelect>
                            <PieCardHints categoryArrayTotal={totalExpenseCategory.categoryMappedData} isMonthData={true} categoryArrayMonth={foundMonthData.categoryPercentages}></PieCardHints>
                          </div>
                          <ExpensesPieChart data={totalExpenseCategory} isMonthData={true} monthData={foundMonthData} />
                        </div>
                      </div>
                    </div>

                    <div className="chart-expense-bottom">
                      <div className="left-div">
                        <ExpensePlanner ExpensePlannerData={expensesReduxData.plannedExpenses} />
                      </div>
                      <div className="right-div">
                        <ExpensesHistory ExpenseHistoryData={expensesReduxData.realExpenses} />
                      </div>
                    </div>
                  </div>

                  <div id="backgroundExpensesAndIncomes" className="backgroundPage">

                  </div>
                </main >
                <CapyAssistant />
              </ChangeFirebaseContext.Provider>
            </>
          }
          break;
      }
    }
  } else if (selectedOption === "Ingresos") {
    if (sessionStorageUserUID) {
      switch (monthSelector) {
        case monthsSelectorNames.total:
          return <>
            <ChangeFirebaseContext.Provider value={{
              setIsInitialized: setIsInitialized,
              fetchAndSetUserData: fetchAndSetUserData,
              logedUserUID: sessionStorageUserUID
            }}>


              <main className="page" id="expensesAndIncomePage">
                <h1 id="expensesAndIncomePageTitle">Expenses & Income</h1>

                <GlobalAppNav></GlobalAppNav>

                <div className="container">
                  <div className="main-div">
                    <select
                      className="select-expenses-graphic"
                      name=""
                      id=""
                      onChange={handleSelectChange}
                    >
                      <option value="Gastos">Expenses</option>
                      <option value="Ingresos">Income</option>
                    </select>
                    <div className="expense-graphic-top">
                      <div className="expense-graphic expense-graphic-color-2">
                        <IncomesGraphic data={mappedIncomeResults} />
                      </div>
                      <div className="piechart-graphic">
                        <div className="pie-card-right">
                          {/* Aqui va el select y los hints */}
                          <PieCardMonthSelect monthsArray={incomeResults.map((income) => income.month)} handleMonthSelectorChannge={handleMonthSelectorChannge}></PieCardMonthSelect>
                          <PieCardHints categoryArrayTotal={totalIncomesCategory.categoryMappedData} isMonthData={false} categoryArrayMonth={[]}></PieCardHints>
                        </div>
                        <IncomesPieChart data={totalIncomesCategory} isMonthData={false} monthData={{ month: "", totalAmount: 0, entryPercentages: [] }} />
                      </div>
                    </div>
                  </div>

                  <div className="chart-expense-bottom">
                    <div className="left-div">
                      <ExpensePlanner ExpensePlannerData={expensesReduxData.plannedExpenses} />
                    </div>
                    <div className="right-div">
                      <IncomeHistory IncomeHistoryData={incomesReduxData.realIncomes} />
                    </div>
                  </div>
                </div>

                <div id="backgroundExpensesAndIncomes" className="backgroundPage">

                </div>
              </main>
              <CapyAssistant />
            </ChangeFirebaseContext.Provider>
          </>
        default:
          if (foundIncomeMonthData) {
            return <>
              <ChangeFirebaseContext.Provider value={{
                setIsInitialized: setIsInitialized,
                fetchAndSetUserData: fetchAndSetUserData,
                logedUserUID: sessionStorageUserUID
              }}>
                <main className="page" id="expensesAndIncomePage">
                  <h1 id="expensesAndIncomePageTitle">Expenses & Income</h1>

                  <GlobalAppNav></GlobalAppNav>

                  <div className="container">
                    <div className="main-div">
                      <select
                        className="select-expenses-graphic"
                        name=""
                        id=""
                        onChange={handleSelectChange}
                      >
                        <option value="Gastos">Expenses</option>
                        <option value="Ingresos">Income</option>
                      </select>
                      <div className="expense-graphic-top">
                        <div className="expense-graphic expense-graphic-color-2">
                          <IncomesGraphic data={mappedIncomeResults} />
                        </div>
                        <div className="piechart-graphic">
                          <div className="pie-card-right">
                            {/* Aqui va el select y los hints */}
                            <PieCardMonthSelect monthsArray={incomeResults.map((income) => income.month)} handleMonthSelectorChannge={handleMonthSelectorChannge}></PieCardMonthSelect>
                            <PieCardHints categoryArrayTotal={totalIncomesCategory.categoryMappedData} isMonthData={true} categoryArrayMonth={foundIncomeMonthData.entryPercentages}></PieCardHints>
                          </div>
                          <IncomesPieChart data={totalIncomesCategory} isMonthData={true} monthData={foundIncomeMonthData} />
                        </div>
                      </div>
                    </div>

                    <div className="chart-expense-bottom">
                      <div className="left-div">
                        <ExpensePlanner ExpensePlannerData={expensesReduxData.plannedExpenses} />
                      </div>
                      <div className="right-div">
                        <IncomeHistory IncomeHistoryData={incomesReduxData.realIncomes} />
                      </div>
                    </div>
                  </div>

                  <div id="backgroundExpensesAndIncomes" className="backgroundPage">

                  </div>
                </main>
                <CapyAssistant />
              </ChangeFirebaseContext.Provider>
            </>
          }
      }
    }
  }
}