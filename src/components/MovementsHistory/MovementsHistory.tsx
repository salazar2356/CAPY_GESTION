// Historial de ingresos y gastos juntos (HU17, HU22, HU23)
import '../expensesAndIncomeScreenComponents/ExpensesHistory/ExpensesHistory.css';
import './MovementsHistory.css';
import '../ui/capyModal.css';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { expenseNameCategories, realExpenseType } from '../../store/expenses/types';
import { incomeNameEntries, realIncomeType } from '../../store/incomes/types';
import { formatDate } from '../../utils/timestampConvertion';
import { MovementKind, MovementModal } from '../MovementModal/MovementModal';

// Iconos de gastos
import cartSvg from '../../assets/desktop/svg/cart.svg';
import shoppingSvg from '../../assets/desktop/svg/shopping.svg';
import homeSvg from '../../assets/desktop/svg/home.svg';
import travelSvg from '../../assets/desktop/svg/icons/globeBlackIcon.svg';
import outingsSvg from '../../assets/desktop/svg/outingsSvg.svg';
import otherExpenseSvg from '../../assets/desktop/svg/otherExpenseSvg.svg';
import familySvg from '../../assets/desktop/svg/familySvg.svg';
import friendsSvg from '../../assets/desktop/svg/friendsSvg.svg';

// Iconos de ingresos
import nuSvg from '../../assets/desktop/svg/nuSvg.svg';
import masterCardSvg from '../../assets/desktop/svg/mastercardSvg.svg';
import visaSvg from '../../assets/desktop/svg/visaSvg.svg';
import efectivoSvg from '../../assets/desktop/svg/efectivoSvg.svg';
import debitoSvg from '../../assets/desktop/svg/debitoSvg.svg';
import otroSvg from '../../assets/desktop/svg/otroSvg.svg';

const EXPENSE_ICONS: Record<string, string> = {
    [expenseNameCategories.mercado]: cartSvg,
    [expenseNameCategories.ropa]: shoppingSvg,
    [expenseNameCategories.hogar]: homeSvg,
    [expenseNameCategories.viajes]: travelSvg,
    [expenseNameCategories.salidas]: outingsSvg,
    [expenseNameCategories.familia]: familySvg,
    [expenseNameCategories.Amigos]: friendsSvg,
    [expenseNameCategories.otro]: otherExpenseSvg,
};

const INCOME_ICONS: Record<string, string> = {
    [incomeNameEntries.nu]: nuSvg,
    [incomeNameEntries.masterCard]: masterCardSvg,
    [incomeNameEntries.visa]: visaSvg,
    [incomeNameEntries.efectivo]: efectivoSvg,
    [incomeNameEntries.debito]: debitoSvg,
    [incomeNameEntries.otro]: otroSvg,
};

export type MovementFilter = 'all' | MovementKind;

// Un movimiento con lo necesario para mostrarlo y editarlo
export interface MovementItem {
    key: string,
    kind: MovementKind,
    date: string,
    amount: number,
    title: string,       // qué hizo con el dinero
    subtitle: string,    // categoría / medio
    icon: string,
    income?: realIncomeType,
    expense?: realExpenseType
}

export const useMovements = (): Array<MovementItem> => {
    const incomes = useSelector((state: RootState) => state.incomes.realIncomes);
    const expenses = useSelector((state: RootState) => state.expenses.realExpenses);

    const items: Array<MovementItem> = [
        ...incomes.map((income, i) => ({
            key: `income-${income.id ?? i}`,
            kind: 'income' as const,
            date: income.incomeDate,
            amount: income.incomeAmount,
            title: `Income: ${income.incomeCategory}`,
            subtitle: `Received in: ${income.incomeEntrie}`,
            icon: INCOME_ICONS[income.incomeEntrie] ?? otroSvg,
            income
        })),
        ...expenses.map((expense, i) => ({
            key: `expense-${expense.id ?? i}`,
            kind: 'expense' as const,
            date: expense.expenseDate,
            amount: expense.expenseAmount,
            title: expense.expenseSite || expense.expenseCategory,
            subtitle: `Category: ${expense.expenseCategory}`,
            icon: EXPENSE_ICONS[expense.expenseCategory] ?? otherExpenseSvg,
            expense
        })),
    ];

    // Los más recientes primero
    return items.sort((a, b) => b.date.localeCompare(a.date));
};

interface MovementRowProps {
    item: MovementItem,
    onSelect: (item: MovementItem) => void
}

export const MovementRow = ({ item, onSelect }: MovementRowProps) => (
    <li
        className="cards-expenses-info movementRow"
        onClick={() => onSelect(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(item) }}
        title="Click to edit or delete"
    >
        <div className="expense-content">
            <img className="image-card-expenses" src={item.icon} alt="" width={50} height={50} />
            <div className="card-container-expense-details">
                <div className="expense-details">
                    <span className={`movementTypeBadge kind-${item.kind}`}>{item.kind === 'income' ? 'Income' : 'Expense'}</span>
                    <h2>{item.title}</h2>
                    <p>{item.subtitle}</p>
                    <p>Date: {formatDate(item.date).toLocaleDateString()}</p>
                </div>
                <p className={`history-expense-amount movementAmount kind-${item.kind}`}>
                    {item.kind === 'income' ? '+' : '-'}${item.amount}
                </p>
            </div>
        </div>
    </li>
);

// Modal para editar/eliminar el movimiento elegido
export const EditMovementModal = ({ item, onClose }: { item: MovementItem, onClose: () => void }) => (
    <MovementModal initialKind={item.kind} income={item.income} expense={item.expense} onClose={onClose} />
);

interface MovementsHistoryProps {
    defaultFilter?: MovementFilter
}

export const MovementsHistory = ({ defaultFilter = 'all' }: MovementsHistoryProps) => {
    const movements = useMovements();
    const [filter, setFilter] = useState<MovementFilter>(defaultFilter);
    const [selected, setSelected] = useState<MovementItem | null>(null);
    const [newKind, setNewKind] = useState<MovementKind | null>(null);

    const visible = filter === 'all' ? movements : movements.filter((m) => m.kind === filter);

    return (
        <div className="generalHistoryExpenses movementsHistory">
            <div className="movementsHistoryTop">
                <h1>History</h1>
                <div className="capyIconButtons">
                    <button className="capyAddMovementButton" onClick={() => setNewKind('income')}>+ Income</button>
                    <button className="capyAddMovementButton" onClick={() => setNewKind('expense')}>+ Expense</button>
                </div>
            </div>

            <div className="movementsFilter" role="tablist" aria-label="Filter movements">
                {([['all', 'All'], ['income', 'Incomes'], ['expense', 'Expenses']] as Array<[MovementFilter, string]>).map(([value, label]) => (
                    <button key={value} role="tab" aria-selected={filter === value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>
                        {label}
                    </button>
                ))}
            </div>

            <ul id="expensesHistoryListContainer" style={{ padding: 0, margin: 0 }}>
                {visible.length === 0 ? (
                    <p className="movementsEmpty">
                        {filter === 'income' ? "You don't have incomes yet." : filter === 'expense' ? "You don't have expenses yet." : "You don't have movements yet."}
                    </p>
                ) : (
                    visible.map((item) => <MovementRow key={item.key} item={item} onSelect={setSelected} />)
                )}
            </ul>

            {newKind && <MovementModal initialKind={newKind} lockKind onClose={() => setNewKind(null)} />}
            {selected && <EditMovementModal item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};
