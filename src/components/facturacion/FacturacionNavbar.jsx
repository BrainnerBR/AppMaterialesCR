import React from 'react';
import { TbPlus, TbListDetails  } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';

const FacturacionNavbar = () => {
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === `/facturacion${path}`;
        return `rounded text-lg px-4 py-2 transition ${
          isActive ? 'bg-primary hover:bg-primary/70 text-text' : 'bg-active text-text hover:bg-hover hover:text-text'
        }`;
      };

  return (
<nav className="p-4">
  <ul className="flex space-x-6">
    <li className='justify-center'>
      <Link to="/facturacion" className={getLinkClass('')}>
        <TbPlus className='inline-block h-full mx-auto mr-2'/>
          Nueva Guía
      </Link>
    </li>
    <li>
      <Link to="/facturacion/todas" className={getLinkClass('/todas')}>
      <TbListDetails className='inline-block h-full mx-auto mr-2' />
         Ver todas las Guías
      </Link>
    </li>
  </ul>
</nav>

  );
};

export default FacturacionNavbar;
