import { createContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../services/Firebase/Firebase';
import { store } from '../../store/store';

export const AuthContext = createContext<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => onAuthStateChanged(auth, (nextUser) => {
        store.dispatch({ type: 'app/reset' });
        sessionStorage.removeItem('userData');
        if (nextUser) sessionStorage.setItem('userUID', nextUser.uid);
        else sessionStorage.removeItem('userUID');
        setUser(nextUser);
        setLoading(false);
    }), []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
