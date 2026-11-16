import { useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { useUserFirebaseData } from '../hooks/useUserFirebaseData';
import { ensureRealUser } from '../services/Firebase/FirestoreUsers';
import { doSignOut } from '../services/Firebase/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useContext(AuthContext);
    const { fetchAndSetUserData } = useUserFirebaseData(user?.uid ?? null);
    const [loadedUID, setLoadedUID] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!user) return;
        let active = true;
        setError('');
        const load = async () => {
            try {
                await ensureRealUser(user);
                const success = await fetchAndSetUserData();
                if (!success) throw new Error('profile-unavailable');
                if (active) setLoadedUID(user.uid);
            } catch {
                if (active) setError('No pudimos cargar tus datos. Comprueba tu conexión e inténtalo de nuevo.');
            }
        };
        void load();
        return () => { active = false; };
    }, [user, fetchAndSetUserData, attempt]);

    if (loading) return <main className="session-status" role="status">Cargando sesión…</main>;
    if (!user) return <Navigate to="/login" replace />;
    if (error) return <main className="session-status">
        <p role="alert">{error}</p>
        <button onClick={() => setAttempt(value => value + 1)}>Reintentar</button>
        <button onClick={() => void doSignOut()}>Cerrar sesión</button>
    </main>;
    if (loadedUID !== user.uid) return <main className="session-status" role="status">Cargando tus datos…</main>;
    return <>{children}</>;
}
