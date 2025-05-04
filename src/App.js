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
                <PrivateLayout>
                  <Facturacion />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
