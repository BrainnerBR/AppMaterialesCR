// App.jsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/PrivateRoute';

import PrivateLayout from './components/layouts/PrivateLayout';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import Facturacion from './components/facturacion/Facturacion';
import Proyectos from './components/proyectos/Proyectos';
import Inventario from './components/inventario/Inventario';
import Visitas from './components/visitas/Visitas';
import TodasLasFacturas from './components/facturacion/TodasLasFacturas';
import NotFound from './routes/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturacion"
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Facturacion />} />
            <Route path="todas" element={<TodasLasFacturas/>} />
          </Route>

          <Route
            path="/proyectos"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Proyectos />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Inventario />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitas"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Visitas />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

            <Route path='*' element={<NotFound/>}/>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
