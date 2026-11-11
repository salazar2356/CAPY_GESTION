// HU20 (registrar ingreso), registrar gasto, HU22 (editar movimiento) y HU23 (eliminar movimiento)
import '../ui/capyModal.css';

import { useContext, useState } from 'react';
import { ChangeFirebaseContext } from '../../Contexts/changeFirebaseContext';
import { expenseNameCategories, realExpenseType } from '../../store/expenses/types';
import { incomeNameCategories, incomeNameEntries, realIncomeType } from '../../store/incomes/types';
import {
    addExpense,
    addIncome,
    deleteExpense,
    deleteIncome,
    getActionErrorMessage,
    updateExpense,
    updateIncome,
    BudgetAlert
} from '../../services/Firebase/FirestoreActions';
import { showRewardToasts, showToast } from '../../utils/toast';

export type MovementKind = 'income' | 'expense';

interface MovementModalProps {
    initialKind: MovementKind,
    // Si llega un movimiento, el modal funciona en modo edición
    income?: realIncomeType,
    expense?: realExpenseType,
    onClose: () => void
}

const toInputDate = (iso?: string) => {
    const date = iso ? new Date(iso) : new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// "2024-11-05" -> Date local a mediodía (evita que cambie de día por la zona horaria)
const fromInputDate = (value: string) => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
};

const incomeEntries = Object.values(incomeNameEntries).filter((e) => e !== incomeNameEntries.cards);
const expenseCategories = Object.values(expenseNameCategories).filter((c) => c !== expenseNameCategories.category);

const showBudgetAlert = (alert: BudgetAlert | null) => {
    if (!alert) return;
    const percentage = Math.round(alert.percentage);
    if (alert.exceeded) {
        showToast(`⚠️ Superaste tu presupuesto de ${alert.category}: $${alert.spent} de $${alert.budget} (${percentage}%)`, 'error', 6000);
    } else {
        showToast(`⚠️ Te estás acercando al límite de ${alert.category}: $${alert.spent} de $${alert.budget} (${percentage}%)`, 'info', 6000);
    }
};

export const MovementModal = ({ initialKind, income, expense, onClose }: MovementModalProps) => {
    const OnChangeFirebase = useContext(ChangeFirebaseContext);
    const isEditing = Boolean(income || expense);

    const [kind, setKind] = useState<MovementKind>(initialKind);
    const [amount, setAmount] = useState<string>(
        income ? String(income.incomeAmount) : expense ? String(expense.expenseAmount) : ''
    );
    const [date, setDate] = useState<string>(toInputDate(income?.incomeDate ?? expense?.expenseDate));

    const [incomeCategory, setIncomeCategory] = useState<incomeNameCategories>(income?.incomeCategory ?? incomeNameCategories.work);
    const [incomeEntrie, setIncomeEntrie] = useState<incomeNameEntries>(income?.incomeEntrie ?? incomeNameEntries.efectivo);

    const [expenseCategory, setExpenseCategory] = useState<expenseNameCategories>(expense?.expenseCategory ?? expenseNameCategories.mercado);
    const [expenseSite, setExpenseSite] = useState<string>(expense?.expenseSite ?? '');

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const uid = OnChangeFirebase.logedUserUID;

    const handleSave = async () => {
        setError('');
        const numericAmount = Number(amount);
        if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError('Escribe un monto mayor que 0.');
            return;
        }
        if (!date) {
            setError('Elige una fecha.');
            return;
        }

        setSaving(true);
        try {
            if (kind === 'income') {
                const input = { incomeCategory, incomeEntrie, incomeAmount: numericAmount, incomeDate: fromInputDate(date) };
                if (income?.id) {
                    await updateIncome(uid, income.id, input);
                    showToast('Ingreso actualizado', 'success');
                } else {
                    const reward = await addIncome(uid, input);
                    showRewardToasts(reward, 'Ingreso registrado');
                }
            } else {
                const input = { expenseCategory, expenseSite, expenseAmount: numericAmount, expenseDate: fromInputDate(date) };
                if (expense?.id) {
                    const alert = await updateExpense(uid, expense.id, input);
                    showToast('Gasto actualizado', 'success');
                    showBudgetAlert(alert);
                } else {
                    const { reward, budgetAlert } = await addExpense(uid, input);
                    showRewardToasts(reward, 'Gasto registrado');
                    showBudgetAlert(budgetAlert);
                }
            }
            await OnChangeFirebase.fetchAndSetUserData();
            onClose();
        } catch (err) {
            console.error(err);
            setError(getActionErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setError('');
        setSaving(true);
        try {
            if (income?.id) await deleteIncome(uid, income.id);
            if (expense?.id) await deleteExpense(uid, expense.id);
            showToast('Movimiento eliminado', 'success');
            await OnChangeFirebase.fetchAndSetUserData();
            onClose();
        } catch (err) {
            console.error(err);
            setError(getActionErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}>
            <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="movementModalTitle">
                <h3 id="movementModalTitle">
                    {isEditing ? 'Edit movement' : 'New movement'}
                </h3>

                {!isEditing && (
                    <div className="capyModalTabs">
                        <button type="button" className={kind === 'income' ? 'active' : ''} onClick={() => setKind('income')}>Income</button>
                        <button type="button" className={kind === 'expense' ? 'active' : ''} onClick={() => setKind('expense')}>Expense</button>
                    </div>
                )}

                {error && <p className="capyModalError">{error}</p>}

                <div className="capyModalField">
                    <label htmlFor="movementAmount">Amount</label>
                    <input
                        id="movementAmount"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {kind === 'income' ? (
                    <>
                        <div className="capyModalField">
                            <label htmlFor="movementIncomeEntry">Where did you receive it?</label>
                            <select id="movementIncomeEntry" value={incomeEntrie} onChange={(e) => setIncomeEntrie(e.target.value as incomeNameEntries)}>
                                {incomeEntries.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                            </select>
                        </div>
                        <div className="capyModalField">
                            <label htmlFor="movementIncomeCategory">Type</label>
                            <select id="movementIncomeCategory" value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value as incomeNameCategories)}>
                                {Object.values(incomeNameCategories).map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="capyModalField">
                            <label htmlFor="movementExpenseCategory">Category</label>
                            <select id="movementExpenseCategory" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value as expenseNameCategories)}>
                                {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="capyModalField">
                            <label htmlFor="movementExpenseSite">Where did you spend it?</label>
                            <input
                                id="movementExpenseSite"
                                type="text"
                                placeholder="e.g. Supermarket"
                                value={expenseSite}
                                onChange={(e) => setExpenseSite(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="capyModalField">
                    <label htmlFor="movementDate">Date</label>
                    <input id="movementDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {confirmDelete ? (
                    <>
                        <p>¿Seguro que quieres eliminar este movimiento? Esta acción no se puede deshacer.</p>
                        <div className="capyModalActions">
                            <button type="button" className="capyBtnSecondary" onClick={() => setConfirmDelete(false)} disabled={saving}>Cancel</button>
                            <button type="button" className="capyBtnDanger" onClick={handleDelete} disabled={saving}>
                                {saving ? 'Deleting...' : 'Yes, delete'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="capyModalActions">
                        <button type="button" className="capyBtnSecondary" onClick={onClose} disabled={saving}>Cancel</button>
                        {isEditing && (
                            <button type="button" className="capyBtnDanger" onClick={() => setConfirmDelete(true)} disabled={saving}>Delete</button>
                        )}
                        <button type="button" className="capyBtnPrimary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
