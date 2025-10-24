import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AuthLanding from './AuthLanding.jsx'
import Signup from './views/Signup.jsx'

const router = createBrowserRouter([
  { path: '/', element: <AuthLanding /> },
  { path: '/signup', element: <Signup />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
