import React from "react";
import { FaHome, FaUser, FaFileInvoice, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Navbar = () => {
  const navigate = useNavigate();


  const handleLogout = async () => {
    await signOut(auth);
    navigate('/')
  }

  return (
<nav className="bg-secondary shadow-md px-8 py-4 flex justify-between items-center text-lg">
      <div className="text-2xl font-bold text-primary">
        FacturaciónApp
      </div>
      <div className="flex gap-8 text-white text-xl ">
        <Link to="/dashboard">
        <FaHome href="/dashboard" className="cursor-pointer rounded-lg transition hover:scale-[1.07] hover:text-primary" />
        </Link>
        <FaUser className="cursor-pointer transition hover:scale-[1.05] text-text hover:text-primary" />
        <FaCog className="cursor-pointer transition hover:scale-[1.05] text-text hover:text-primary" />
        <div>
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-text hover:text-red-500 transition hover:scale-[1.07]"
    >
      <FaSignOutAlt />
      <span></span>
    </button>
  </div>
      </div>
    </nav>
  );
};

export default Navbar;
