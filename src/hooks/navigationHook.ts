import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../types/routesEnum";
import { doSignOut } from "../services/Firebase/auth";

export const NavigationHook = () => {
    const navigate = useNavigate();

    const navigateToDashboard = useCallback(() => navigate(routes.dashboard), [navigate]);
    const navigateToExpensesAndIncomes = useCallback(() => navigate(routes.expensesAndIncome), [navigate]);
    const navigateToSavings = useCallback(() => navigate(routes.savings), [navigate]);
    const navigateToRewards = useCallback(() => navigate(routes.rewards), [navigate]);
    const navigateToLogin = useCallback(() => navigate(routes.login), [navigate]);
    const navigateToRegister = useCallback(() => navigate(routes.register), [navigate]);
    const navigateToLanding = useCallback(() => navigate(routes.landingPage), [navigate]);
    const navigateToSettings = useCallback(() => navigate(routes.settings), [navigate]);
    const navigateToProfile = useCallback(() => navigate(routes.profilePage), [navigate]);
    const navigateToMascot = useCallback(() => navigate(routes.mascot), [navigate]);

    // Cierra la sesión también en Firebase Auth
    const handleLogOut = useCallback(() => {
        sessionStorage.removeItem('userUID');
        doSignOut().catch((err) => console.error('Error al cerrar sesión:', err));
        navigateToLogin();
    }, [navigateToLogin]);

    const handleNavigation = {
        navigateToDashboard,
        navigateToExpensesAndIncomes,
        navigateToSavings,
        navigateToRewards,
        navigateToLogin,
        navigateToRegister,
        navigateToLanding,
        navigateToSettings,
        navigateToProfile,
        navigateToMascot,
    };

    return {
        handleNavigation,
        handleLogOut
    };
};
