// HU56: muestra los avisos dentro de la plataforma según las preferencias del usuario.
// Se monta en el menú lateral (GlobalAppNav), que está en todas las pantallas con sesión.
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { dayKey } from '../../services/Firebase/FirestoreActions';
import { getWeekStartKey } from '../../utils/weeklyMissions';
import { showToast } from '../../utils/toast';

const DAY_MS = 24 * 60 * 60 * 1000;

// Para no repetir un aviso el mismo día (se guarda solo en este navegador)
const alreadyShown = (key: string) => {
    try { return localStorage.getItem(key) === '1'; } catch { return false; }
};
const markShown = (key: string) => {
    try { localStorage.setItem(key, '1'); } catch { /* sin almacenamiento: puede repetirse */ }
};

export const NotificationCenter = () => {
    const uid = useSelector((state: RootState) => state.userData.userUID);
    const prefs = useSelector((state: RootState) => state.userData.notificationPrefs);
    const pointsHistory = useSelector((state: RootState) => state.rewards.pointsHistory);
    const weeklyMissions = useSelector((state: RootState) => state.rewards.weeklyMissions);
    const savings = useSelector((state: RootState) => state.savings.savingsData);

    // Recordatorio diario a la hora elegida (CA3)
    useEffect(() => {
        if (!uid || !prefs.dailyReminder) return;

        const check = () => {
            const now = new Date();
            const [h, m] = prefs.reminderHour.split(':').map(Number);
            const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
            if (now < reminderTime) return;

            const today = dayKey(now);
            const key = `capy-daily-${uid}-${today}`;
            const registeredToday = pointsHistory.some((p) => p.reason.startsWith('Registered an') && dayKey(new Date(p.date)) === today);
            if (registeredToday || alreadyShown(key)) return;

            showToast('⏰ Capy te recuerda: registra tus ingresos y gastos de hoy.', 'info', 7000);
            markShown(key);
        };

        check();
        const interval = setInterval(check, 60 * 1000);
        return () => clearInterval(interval);
    }, [uid, prefs.dailyReminder, prefs.reminderHour, pointsHistory]);

    // Recordatorio de metas sin aportes en 14 días (una vez al día)
    useEffect(() => {
        if (!uid || !prefs.goalReminders) return;
        const key = `capy-goals-${uid}-${dayKey()}`;
        if (alreadyShown(key)) return;

        const now = Date.now();
        const forgotten = savings.filter((s) => {
            if (s.paused || s.completed || s.savingActualFee >= s.savingTotalFee) return false;
            const deposits = (s.savingHistory || []).filter((h) => h.deposit > 0);
            if (deposits.length === 0) return false;
            const last = Math.max(...deposits.map((h) => new Date(h.date).getTime()));
            return now - last >= 14 * DAY_MS;
        });
        if (forgotten.length === 0) return;

        showToast(`🎯 No has aportado a "${forgotten[0].savingName}" en 14 días. ¡Retómala en Savings!`, 'info', 7000);
        markShown(key);
    }, [uid, prefs.goalReminders, savings]);

    // Aviso de misiones semanales nuevas (una vez por semana)
    useEffect(() => {
        if (!uid || !prefs.newMissions) return;
        const weekStart = getWeekStartKey();
        if (weeklyMissions.weekStart !== weekStart) return;
        const key = `capy-weekly-${uid}-${weekStart}`;
        if (alreadyShown(key)) return;

        showToast(`🏆 Tienes ${weeklyMissions.missions.length} misiones semanales nuevas en Rewards.`, 'info', 6000);
        markShown(key);
    }, [uid, prefs.newMissions, weeklyMissions]);

    return null;
};
