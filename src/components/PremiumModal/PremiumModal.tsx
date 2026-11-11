// HU59: conocer el plan premium
import '../ui/capyModal.css';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { registerPremiumInterest, getActionErrorMessage } from '../../services/Firebase/FirestoreActions';
import { showToast } from '../../utils/toast';

const FEATURES: Array<{ feature: string, free: string, premium: string }> = [
    { feature: 'Register incomes and expenses', free: '✔', premium: '✔' },
    { feature: 'Savings goals', free: 'Up to 3', premium: 'Unlimited' },
    { feature: 'Missions and rewards', free: 'Basic', premium: 'Weekly + exclusive rewards' },
    { feature: 'Capy assistant', free: 'Basic tips', premium: 'Personalized monthly plan' },
    { feature: 'Reports', free: 'Current month', premium: 'Full history + export' },
    { feature: 'Capypoints', free: 'x1', premium: 'x2 on every action' },
];

export const PremiumModal = ({ onClose }: { onClose: () => void }) => {
    const reduxUID = useSelector((state: RootState) => state.userData.userUID);
    const uid = reduxUID || sessionStorage.getItem('userUID') || '';
    const [busy, setBusy] = useState(false);

    // Guarda en Firestore que al usuario le interesa el plan (para medir la demanda)
    const handleInterest = async () => {
        setBusy(true);
        try {
            await registerPremiumInterest(uid);
            showToast('¡Gracias! Te avisaremos cuando Capy Premium esté disponible.', 'success', 5000);
            onClose();
        } catch (err) {
            console.error(err);
            showToast(getActionErrorMessage(err), 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
            <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="premiumTitle" style={{ width: 'min(560px, 100%)' }}>
                <p style={{ fontSize: '44px', textAlign: 'center' }}>✨</p>
                <h3 id="premiumTitle">Capy Premium</h3>
                <p style={{ textAlign: 'center' }}>Take your finances to the next level for <strong>$9.900 COP / month</strong>.</p>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px 4px' }}></th>
                                <th style={{ padding: '8px 4px' }}>Free</th>
                                <th style={{ padding: '8px 4px', color: '#A8F25D' }}>Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FEATURES.map((row) => (
                                <tr key={row.feature} style={{ borderTop: '1px solid rgba(249,249,249,0.2)' }}>
                                    <td style={{ padding: '8px 4px' }}>{row.feature}</td>
                                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{row.free}</td>
                                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700 }}>{row.premium}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p style={{ fontSize: '13px', opacity: 0.8, textAlign: 'center' }}>Premium is coming soon. Tell us if you are interested and we will let you know.</p>

                <div className="capyModalActions">
                    <button type="button" className="capyBtnSecondary" onClick={onClose} disabled={busy}>Maybe later</button>
                    <button type="button" className="capyBtnPrimary" onClick={handleInterest} disabled={busy || !uid}>
                        {busy ? 'Saving...' : "I'm interested"}
                    </button>
                </div>
            </div>
        </div>
    );
};
