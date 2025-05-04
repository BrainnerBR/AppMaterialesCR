// PrivateLayout.jsx
import React from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Toaster } from "react-hot-toast";

const PrivateLayout = ({ children }) => {
  return (
    <div className="max-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-10 ml-60">
          <div className="w-full max-w-6xl mx-auto">{children}</div> 
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default PrivateLayout;
