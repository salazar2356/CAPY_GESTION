import './index.css'

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { createHashRouter, RouterProvider } from 'react-router-dom'
import { mainRoutes } from './routes/mainRoutes';
import { Provider } from 'react-redux';
import { store } from './store/store';

// HU06: Firebase abre el enlace del correo como "...?mode=resetPassword&oobCode=...".
// Como la app usa rutas con "#", se envía a la página #/auth-action conservando los parámetros.
const actionParams = new URLSearchParams(window.location.search);
if (actionParams.get('mode') && actionParams.get('oobCode') && !window.location.hash.startsWith('#/auth-action')) {
  window.location.hash = `/auth-action?${actionParams.toString()}`;
}

const router = createHashRouter([
  ...mainRoutes
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  /* </StrictMode> */
)