// HU18: mis medios de pago, mostrados como tarjetas en el dashboard
import './CardsSpace.css';
import '../../ui/capyModal.css';
import '../DebitCard/DebitCard.css';
import '../AddCard/addCard.css';

import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext';
import {
  addPaymentMethod,
  deletePaymentMethod,
  getActionErrorMessage,
  PAYMENT_METHOD_TYPES
} from '../../../services/Firebase/FirestoreActions';
import { showToast } from '../../../utils/toast';
import type { paymentMethodType } from '../../../types/firebaseUserTypes';

import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'

const CARD_STYLES: Record<string, { bg: string, text: string }> = {
  'Efectivo': { bg: '#A8F25D', text: '#121212' },
  'Nequi': { bg: '#F9F9F9', text: '#391881' },
  'Daviplata': { bg: '#F2622E', text: '#F9F9F9' },
  'Tarjeta débito': { bg: '#2D18BF', text: '#F9F9F9' },
  'Tarjeta crédito': { bg: '#4A00E0', text: '#F9F9F9' },
  'Otro': { bg: '#3C3C3C', text: '#F9F9F9' },
};

export const CardsSpace = () => {
  const methods = useSelector((state: RootState) => state.userData.paymentMethods);
  const expenses = useSelector((state: RootState) => state.expenses.realExpenses);
  const reduxUID = useSelector((state: RootState) => state.userData.userUID);
  const OnChangeFirebase = useContext(ChangeFirebaseContext);
  const uid = OnChangeFirebase.logedUserUID || reduxUID;

  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState<paymentMethodType | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState(PAYMENT_METHOD_TYPES[1]);
  const [last4, setLast4] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Gastado este mes con cada medio
  const now = new Date();
  const spentWith = (methodId: string) => expenses
    .filter((e) => {
      const d = new Date(e.expenseDate);
      return e.paymentMethodId === methodId && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, e) => acc + e.expenseAmount, 0);

  const openAdd = () => {
    setName(''); setType(PAYMENT_METHOD_TYPES[1]); setLast4(''); setError('');
    setShowAdd(true);
  };

  const handleAdd = async () => {
    setError('');
    setBusy(true);
    try {
      await addPaymentMethod(uid, { name, type, last4 });
      showToast('Medio de pago agregado', 'success');
      setShowAdd(false);
      await OnChangeFirebase.fetchAndSetUserData();
    } catch (err) {
      console.error(err);
      setError(getActionErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deletePaymentMethod(uid, toDelete.id);
      showToast('Medio de pago eliminado', 'success');
      setToDelete(null);
      await OnChangeFirebase.fetchAndSetUserData();
    } catch (err) {
      console.error(err);
      showToast(getActionErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const movementsWith = (methodId: string) => expenses.filter((e) => e.paymentMethodId === methodId).length;

  return (
    <>
      <div className='cardSpace'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />
        <h2>Your cards</h2>
        <button className='ButtonAdd' onClick={openAdd}>Add card</button>

        {methods.map((method) => {
          const style = CARD_STYLES[method.type] ?? CARD_STYLES['Otro'];
          return (
            <div key={method.id} className='cardContainer' style={{ backgroundColor: style.bg, position: 'relative' }}>
              <button
                onClick={() => setToDelete(method)}
                aria-label={`Delete ${method.name}`}
                title="Delete"
                style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', color: style.text, cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
              >✕</button>
              <div className='top-row'>
                <h2 className='amount' style={{ color: style.text }}>{method.name}</h2>
              </div>
              <h2 className='subtitle' style={{ color: style.text }}>{method.type.toUpperCase()}</h2>
              <h2 className='cardNumber' style={{ color: style.text }}>
                {method.last4 ? `**** **** **** ${method.last4}` : 'No number'} · Spent this month: ${spentWith(method.id)}
              </h2>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !busy) setShowAdd(false) }}>
          <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="addMethodTitle">
            <h3 id="addMethodTitle">New payment method</h3>
            {error && <p className="capyModalError">{error}</p>}
            <div className="capyModalField">
              <label htmlFor="methodName">Name</label>
              <input id="methodName" type="text" placeholder="e.g. My Nequi" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="capyModalField">
              <label htmlFor="methodType">Type</label>
              <select id="methodType" value={type} onChange={(e) => setType(e.target.value)}>
                {PAYMENT_METHOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="capyModalField">
              <label htmlFor="methodLast4">Last 4 digits (optional)</label>
              <input id="methodLast4" type="text" inputMode="numeric" maxLength={4} placeholder="1234"
                value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </div>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>Capy never asks for your full card number, expiration date or security code.</p>
            <div className="capyModalActions">
              <button type="button" className="capyBtnSecondary" onClick={() => setShowAdd(false)} disabled={busy}>Cancel</button>
              <button type="button" className="capyBtnPrimary" onClick={handleAdd} disabled={busy}>{busy ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="capyModalBackdrop">
          <div className="capyModal" role="alertdialog" aria-modal="true">
            <h3>Delete payment method</h3>
            <p>¿Eliminar "{toDelete.name}"?
              {movementsWith(toDelete.id) > 0 && ` Sus ${movementsWith(toDelete.id)} gasto(s) se conservarán como "Sin medio".`}
            </p>
            <div className="capyModalActions">
              <button type="button" className="capyBtnSecondary" onClick={() => setToDelete(null)} disabled={busy}>Cancel</button>
              <button type="button" className="capyBtnDanger" onClick={handleDelete} disabled={busy}>{busy ? 'Deleting...' : 'Yes, delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
