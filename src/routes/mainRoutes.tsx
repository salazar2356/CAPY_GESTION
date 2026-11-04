//Import router enum
import { routes } from "../types/routesEnum";

//Import pages

import { LogIn } from "../pages/LogIn/LogIn";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { SavingsPage } from "../pages/savingsPage/savingsPage";
import { Rewards } from "../pages/Rewards/Rewards";
import { ExpensesAndIncomePage } from "../pages/IncomeAndIncrease/ExpensesAndIncome";
import { ProfilePage } from "../pages/profilePage/profilePage";


export const mainRoutes = [
    {
        path: routes.landingPage,
        element: <LandingPage></LandingPage>,
    },
    {
        path: routes.login,
        element: <LogIn></LogIn>,
    },
    {
        path: routes.register,
        element: <Register></Register>,
    },
    {
        path: routes.dashboard,
        element: <Dashboard></Dashboard>,
    },
    {
        path: routes.savings,
        element: <SavingsPage></SavingsPage>,
    },
    {
        path: routes.rewards,
        element: <Rewards></Rewards>,
    },
    {
        path: routes.expensesAndIncome,
        element: <ExpensesAndIncomePage></ExpensesAndIncomePage>,
    },
    {
        path: routes.profilePage,
        element: <ProfilePage></ProfilePage>,
    }
]

