// PrivateLayout.jsx
import React from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const  PrivateLayout = ({ children }) => {
  return (
<div className="h-screen flex flex-col">
  {/* Navbar fijo en la parte superior */}
  <div className="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>

  {/* Contenedor lateral + contenido desplazable */}
  <div className="flex flex-1 pt-[64px]"> {/* Ajusta el padding-top según altura del navbar */}
    {/* Sidebar fijo */}
    <div className="fixed left-0 top-[64px] w-60 h-[calc(100vh-64px)] z-40">
      <Sidebar />
    </div>

    {/* Main con scroll */}
    <main className="flex-1 ml-60 h-[calc(100vh-64px)] overflow-y-auto p-10">
      <div className="w-full max-w-6xl mx-auto">{children}</div>
      <Outlet />
    </main>
  </div>

  <Toaster position="top-center" reverseOrder={false} />
</div>

  );
};

export default PrivateLayout;
