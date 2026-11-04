import { useEffect, useState } from "react";
import "./IncomeHistory.css";
import { incomeNameEntries, realIncomeType } from "../../../store/incomes/types";

// Importa las imágenes
import nuSvg from '../../../assets/desktop/svg/nuSvg.svg';
import masterCardSvg from '../../../assets/desktop/svg/mastercardSvg.svg';
import visaSvg from '../../../assets/desktop/svg/visaSvg.svg';
import efectivoSvg from '../../../assets/desktop/svg/efectivoSvg.svg';
import debitoSvg from '../../../assets/desktop/svg/debitoSvg.svg';
import otroSvg from '../../../assets/desktop/svg/otroSvg.svg';
import { formatDate } from "../../../utils/timestampConvertion";

interface IncomeHistoryProps {
  IncomeHistoryData: realIncomeType[];
}

export const IncomeHistory = ({ IncomeHistoryData }: IncomeHistoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<incomeNameEntries>(incomeNameEntries.cards); // Estado para la categoría seleccionada
  const [filteredIncomes, setFilteredIncomes] = useState<realIncomeType[]>([]);

  // Manejador del cambio en el select
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as incomeNameEntries);
  };

  useEffect(() => {
    const updateFilteredIncomes = () => {
      let incomesToFilter = IncomeHistoryData;

      if (selectedCategory !== incomeNameEntries.cards) {
        incomesToFilter = IncomeHistoryData.filter(
          (income) => income.incomeEntrie === selectedCategory
        );
      }

      const newFilterIncomes = incomesToFilter.map((income) => {
        const updatedIncome = { ...income };
        switch (income.incomeEntrie) {
          case incomeNameEntries.nu:
            updatedIncome.incomeImage = nuSvg;
            break;
          case incomeNameEntries.masterCard:
            updatedIncome.incomeImage = masterCardSvg;
            break;
          case incomeNameEntries.visa:
            updatedIncome.incomeImage = visaSvg;
            break;
          case incomeNameEntries.efectivo:
            updatedIncome.incomeImage = efectivoSvg;
            break;
          case incomeNameEntries.debito:
            updatedIncome.incomeImage = debitoSvg;
            break;
          case incomeNameEntries.otro:
            updatedIncome.incomeImage = otroSvg;
            break;
          default:
            break;
        }
        return updatedIncome;
      });

      setFilteredIncomes(newFilterIncomes);
    };

    updateFilteredIncomes();
  }, [IncomeHistoryData, selectedCategory]);

  return (
    <div className="generalHistoryIncomes">
      <div className="topHistoryIncomes">
        <h1>History</h1>
        <select
          className="select-history-incomes"
          name="categories"
          onChange={handleChange}
          value={selectedCategory}
          required
        >
          {Object.values(incomeNameEntries).map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredIncomes.length > 0 ? (
          filteredIncomes.map((incomes, index) => (
            <li
              className="cards-incomes-info"
              key={index}
              style={{ marginBottom: "20px", listStyleType: "none" }}
            >
              <div className="incomes-content">
                <img
                  className="image-card-incomes"
                  src={incomes.incomeImage || ""}
                  alt={incomes.incomeEntrie}
                  width={50}
                  height={50}
                />
                <div className="card-container-incomes-details">
                  <div className="incomes-details">
                    <p>
                      {formatDate(incomes.incomeDate).toLocaleDateString()}
                    </p>
                    <p>{incomes.incomeEntrie}</p>
                  </div>
                  <p className="history-incomes-amount">${incomes.incomeAmount}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No hay ingresos para la categoría seleccionada.</p>
        )}
      </div>
    </div>
  );
};
