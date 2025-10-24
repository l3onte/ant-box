import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './services/userContext.jsx'
import './index.css'
import AuthLanding from './AuthLanding.jsx'
import Signup from './views/Signup.jsx'
import Login from './views/Login.jsx'
import Dashboard from './views/Dashboard.jsx'
import Layout from './layout/Layout.jsx'

const router = createBrowserRouter([
  { path: '/', element: <AuthLanding /> },
  { path: '/signup', element: <Signup />},
  { path: '/login', element: <Login />},
  { 
    element: <Layout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> }
    ]
   }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
