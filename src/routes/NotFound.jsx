// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg mb-4">Ups! Página no encontrada</p>
      <Link
        to="/dashboard"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
