// HU56: configurar mis notificaciones (se guardan en Firestore al cambiar cada opción)
import '../ui/capyModal.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUserPreferences } from '../../store/userData/slice';
import { getActionErrorMessage, setNotificationPrefs } from '../../services/Firebase/FirestoreActions';
import { showToast } from '../../utils/toast';
import type { notificationPrefsType } from '../../types/firebaseUserTypes';

const OPTIONS: Array<{ key: keyof Omit<notificationPrefsType, 'reminderHour'>, label: string, hint: string }> = [
    { key: 'dailyReminder', label: 'Daily reminder', hint: 'Reminds you to register your movements of the day.' },
    { key: 'budgetAlerts', label: 'Budget alerts', hint: 'Warns you when a category reaches 80% or more of its budget.' },
    { key: 'goalReminders', label: 'Goal reminders', hint: 'Reminds you about goals without deposits in 14 days.' },
    { key: 'newMissions', label: 'New missions', hint: 'Tells you when new weekly missions are available.' },
];

export const NotificationsModal = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch();
    const uid = useSelector((state: RootState) => state.userData.userUID);
    const saved = useSelector((state: RootState) => state.userData.notificationPrefs);
    const [prefs, setPrefs] = useState<notificationPrefsType>(saved);
    const [error, setError] = useState('');

    const save = async (next: notificationPrefsType) => {
        setError('');
        const previous = prefs;
        setPrefs(next);
        dispatch(setUserPreferences({ notificationPrefs: next }));
        try {
            await setNotificationPrefs(uid, next);
        } catch (err) {
            console.error(err);
            setPrefs(previous);
            dispatch(setUserPreferences({ notificationPrefs: previous }));
            setError(getActionErrorMessage(err));
        }
    };

    const close = () => {
        showToast('Preferencias de notificaciones guardadas', 'success');
        onClose();
    };

    return (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget) close() }}>
            <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="notificationsTitle">
                <h3 id="notificationsTitle">Notifications</h3>
                {error && <p className="capyModalError">{error}</p>}

                {OPTIONS.map((option) => (
                    <div key={option.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                            <p style={{ fontWeight: 700 }}>{option.label}</p>
                            <p style={{ fontSize: '13px', opacity: 0.8 }}>{option.hint}</p>
                        </div>
                        <label className="switch" style={{ flexShrink: 0 }}>
                            <input
                                type="checkbox"
                                aria-label={option.label}
                                checked={prefs[option.key]}
                                onChange={(e) => save({ ...prefs, [option.key]: e.target.checked })}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}

                {/* CA3: hora del recordatorio diario */}
                {prefs.dailyReminder && (
                    <div className="capyModalField">
                        <label htmlFor="reminderHour">Daily reminder time</label>
                        <input
                            id="reminderHour"
                            type="time"
                            value={prefs.reminderHour}
                            onChange={(e) => { if (e.target.value) save({ ...prefs, reminderHour: e.target.value }) }}
                        />
                    </div>
                )}

                <p style={{ fontSize: '13px', opacity: 0.8 }}>Notifications appear inside Capy while you use the platform.</p>

                <div className="capyModalActions">
                    <button type="button" className="capyBtnPrimary" onClick={close}>Done</button>
                </div>
            </div>
        </div>
    );
};
