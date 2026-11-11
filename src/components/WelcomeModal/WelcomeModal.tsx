// HU09: bienvenida la primera vez que el usuario entra después de crear su cuenta
import '../ui/capyModal.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { markWelcomeSeen } from '../../services/Firebase/FirestoreActions';
import { updateAllUserSlice } from '../../store/userData/slice';
import { NavigationHook } from '../../hooks/navigationHook';

export const WelcomeModal = () => {
    const userData = useSelector((state: RootState) => state.userData);
    const dispatch = useDispatch();
    const { handleNavigation } = NavigationHook();
    const [closing, setClosing] = useState(false);

    if (userData.welcomeSeen || !userData.userUID) return null;

    const close = async (goTo?: () => void) => {
        setClosing(true);
        try {
            await markWelcomeSeen(userData.userUID);
        } catch (err) {
            console.error('No se pudo guardar la bienvenida:', err);
        }
        dispatch(updateAllUserSlice({ ...userData, welcomeSeen: true }));
        if (goTo) goTo();
    };

    return (
        <div className="capyModalBackdrop">
            <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="welcomeTitle" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '56px' }}>👋</p>
                <h3 id="welcomeTitle">¡Bienvenido a Capy, {userData.userName}!</h3>
                <p>Capy te ayuda a controlar tus finanzas mientras ganas Capypoints:</p>
                <ul style={{ textAlign: 'left', margin: '0', paddingLeft: '20px', lineHeight: 1.6 }}>
                    <li>Registra tus ingresos y gastos.</li>
                    <li>Crea metas de ahorro y haz aportes.</li>
                    <li>Completa misiones, sube de nivel y canjea recompensas.</li>
                </ul>
                <div className="capyModalActions">
                    <button type="button" className="capyBtnSecondary" onClick={() => close()} disabled={closing}>Explore dashboard</button>
                    <button type="button" className="capyBtnPrimary" onClick={() => close(handleNavigation.navigateToExpensesAndIncomes)} disabled={closing}>
                        Register my first income
                    </button>
                </div>
            </div>
        </div>
    );
};
