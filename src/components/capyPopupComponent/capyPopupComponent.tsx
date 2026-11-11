// Asistente Capy: HU53 (consejos según mis gastos) y HU54 (motivación sobre mis metas)
import { useState } from "react";
import { useSelector } from "react-redux";
import "./capyPopupComponent.css";

import fondoAddSavingsModal from '../../assets/desktop/jpg/fondoAddSavingsModal.jpg'
import { RootState } from "../../store/store";
import { capyAdviceContext, getGoalMotivation, getSpendingAdvice } from "../../utils/capyAdvice";
import { PremiumModal } from "../PremiumModal/PremiumModal";

const money = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`

const ideas = [
  "Try the 50/30/20 rule: 50% for needs, 30% for wants and 20% for savings.",
  "Before buying something you don't need, wait 24 hours. Most impulses disappear.",
  "Set a small savings goal for this month. Small wins keep you motivated!",
  "Review your subscriptions: cancel the ones you haven't used this month.",
  "Plan your groceries with a list. It is one of the easiest ways to save.",
];

export const CapyPopup = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);

  const realExpenses = useSelector((state: RootState) => state.expenses.realExpenses);
  const plannedExpenses = useSelector((state: RootState) => state.expenses.plannedExpenses);
  const realIncomes = useSelector((state: RootState) => state.incomes.realIncomes);
  const savings = useSelector((state: RootState) => state.savings.savingsData);
  const totalBalance = useSelector((state: RootState) => state.userData.totalBalance);

  const ctx: capyAdviceContext = { realExpenses, plannedExpenses, realIncomes, savings };

  // Resumen de las métricas principales con los datos reales del usuario
  const explainMetrics = () => {
    const now = new Date();
    const inMonth = (iso: string) => {
      const d = new Date(iso);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };
    const monthIncome = realIncomes.filter((i) => inMonth(i.incomeDate)).reduce((a, i) => a + i.incomeAmount, 0);
    const monthExpenses = realExpenses.filter((e) => inMonth(e.expenseDate)).reduce((a, e) => a + e.expenseAmount, 0);
    const saved = savings.reduce((a, s) => a + s.savingActualFee, 0);

    return `Total Balance (${money(totalBalance)}) is everything you earned minus everything you spent.\n\n` +
      `This month you earned ${money(monthIncome)} and spent ${money(monthExpenses)}.\n\n` +
      `Savings (${money(saved)}) is the money you put in your goals.`;
  };

  const options: Array<{ label: string, action: () => string | null }> = [
    { label: "Give me a suggestion", action: () => getSpendingAdvice(ctx) },        // HU53
    { label: "Motivate me with my goals", action: () => getGoalMotivation(ctx) },   // HU54
    { label: "Explain the metrics to me", action: explainMetrics },
    { label: "Give me an idea", action: () => ideas[Math.floor(Math.random() * ideas.length)] },
    { label: "Capy Premium ✨", action: () => { setShowPremium(true); return null; } }, // HU59
  ];

  return (
    <>
      <div className="capy-popup" style={{ backgroundImage: fondoAddSavingsModal }}>
        {message === null ? (
          options.map((option) => (
            <button key={option.label} className="popup-btn" onClick={() => setMessage(option.action())}>
              {option.label}
            </button>
          ))
        ) : (
          <div className="message-container">
            <p>{message}</p>
            <button className="popup-btn" onClick={() => setMessage(null)}>
              Back
            </button>
          </div>
        )}
      </div>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </>
  );
};
