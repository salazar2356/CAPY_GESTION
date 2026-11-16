/* eslint-disable react-refresh/only-export-components -- This module exports route configuration. */
//Import router enum
import { routes } from "../types/routesEnum";

//Import pages

import { lazy } from 'react';
const LogIn = lazy(() => import('../pages/LogIn/LogIn').then(module => ({ default: module.LogIn })));
const LandingPage = lazy(() => import('../pages/LandingPage/LandingPage').then(module => ({ default: module.LandingPage })));
const Register = lazy(() => import('../pages/Register/Register').then(module => ({ default: module.Register })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const ExpensesAndIncomePage = lazy(() => import('../pages/IncomeAndIncrease/ExpensesAndIncome').then(module => ({ default: module.ExpensesAndIncomePage })));
const ProfilePage = lazy(() => import('../pages/profilePage/profilePage').then(module => ({ default: module.ProfilePage })));
import { ProtectedRoute } from './ProtectedRoute';
const FinanceOverview = lazy(() => import('../pages/FinanceOverview/FinanceOverview').then(module => ({ default: module.FinanceOverview })));
import { Navigate } from 'react-router-dom';


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
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    },
  
    {
        path: routes.expensesAndIncome,
        element: <ProtectedRoute><ExpensesAndIncomePage /></ProtectedRoute>,
    },
    {
        path: routes.profilePage,
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
    },
    { path: routes.savings, element: <ProtectedRoute><FinanceOverview kind="savings" /></ProtectedRoute> },
    { path: routes.rewards, element: <ProtectedRoute><FinanceOverview kind="rewards" /></ProtectedRoute> },
    { path: routes.settings, element: <Navigate to={routes.profilePage} replace /> },
    { path: routes.profile, element: <Navigate to={routes.profilePage} replace /> },
    { path: '*', element: <Navigate to={routes.landingPage} replace /> },
]

