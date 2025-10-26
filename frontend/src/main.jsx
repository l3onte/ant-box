import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './services/userContext.jsx'
import { StoreProvider } from './services/storeContext.jsx'
import './index.css'
import AuthLanding from './AuthLanding.jsx'
import Signup from './views/Signup.jsx'
import Login from './views/Login.jsx'
import Layout from './layout/Layout.jsx'
import Dashboard from './views/menuPrincipal/Dashboard.jsx'
import Vendedores from './views/menuPrincipal/Vendedores.jsx'
import Clientes from './views/menuPrincipal/Clientes.jsx'
import Proveedores from './views/menuPrincipal/Proveedores.jsx'
import Productos from './views/menuPrincipal/Productos.jsx'
import Ventas from './views/reportes/Ventas.jsx'
import Compras from './views/reportes/Compras.jsx'
import Ganancias from './views/reportes/Ganancias.jsx'
import Inventario from './views/reportes/Inventario.jsx'

const router = createBrowserRouter([
  { path: '/', element: <AuthLanding /> },
  { path: '/signup', element: <Signup />},
  { path: '/login', element: <Login />},
  { 
    element: <Layout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/vendedores', element: <Vendedores /> },
      { path: '/clientes', element: <Clientes /> },
      { path: '/proveedores', element: <Proveedores /> },
      { path: '/productos', element: <Productos /> },
      { path: '/ventas', element: <Ventas /> },
      { path: '/compras', element: <Compras /> },
      { path: '/ganancias', element: <Ganancias /> },
      { path: '/inventario', element: <Inventario /> }
    ]
   }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </StoreProvider>
  </StrictMode>,
)
