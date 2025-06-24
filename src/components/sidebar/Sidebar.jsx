// Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { FaFileInvoice, FaProjectDiagram, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';


const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {path: '/facturacion', label: 'Guías de Entrega', icon: <FaFileInvoice className='w-5 h-5 text-text' />},
    { path: '/dashboard', label: 'Dashboard', icon: <BsGraphUpArrow className="w-5 h-5 text-text" /> },
    { path: '/proyectos', label: 'Proyectos', icon: <FaProjectDiagram className="w-5 h-5 text-text" /> },
    { path: '/inventario', label: 'Inventario', icon: <FaBoxOpen className="w-5 h-5 text-text" /> },
    { path: '/visitas', label: 'Visitas', icon: <FaMapMarkerAlt className="w-5 h-5 text-text" /> },
  ];


  return (
<aside
  className="fixed left-0 z-0 w-60 h-screen shadow-md sm:translate-x-0 bg-secondary text-lg flex flex-col justify-between"
  aria-label="Sidebar"
>
  {/* Parte superior scrollable */}
  <div className="flex-1 px-3 py-4 overflow-y-auto">
    <ul className="space-y-2 font-medium text-text">
      {navItems.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`flex items-center p-5 rounded-lg transition duration-300 ease-in-out ${
              currentPath.startsWith(item.path)
                ? 'bg-active text-text'
                : 'hover:bg-hover hover:text-text'
            }`}
          >
            {item.icon}
            <span className="ms-3">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>

  </div>
</aside>

  );
};

export default Sidebar;
