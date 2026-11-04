import './index.css'

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { createHashRouter, RouterProvider } from 'react-router-dom'
import { mainRoutes } from './routes/mainRoutes';
import { Provider } from 'react-redux';
import { store } from './store/store';

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