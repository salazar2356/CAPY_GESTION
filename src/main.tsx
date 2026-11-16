import './index.css'

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { createHashRouter, RouterProvider } from 'react-router-dom'
import { mainRoutes } from './routes/mainRoutes';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './Contexts/AuthContext';
import { Suspense } from 'react';

const router = createHashRouter([
  ...mainRoutes
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <AuthProvider>
      <Suspense fallback={<main className="session-status" role="status">Cargando Capy…</main>}>
      <RouterProvider router={router} />
      </Suspense>
      </AuthProvider>
    </Provider>
  /* </StrictMode> */
)
