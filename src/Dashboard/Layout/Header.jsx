// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/f7de514a-567b-44f4-a60b-30521f14f728-removebg-preview.png';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; 

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#9333EA] text-white p-4 flex items-center justify-between">
      <img src={logo} alt="Logo" className="h-10 w-auto" />
      <button
        onClick={logout}
        className="bg-[#ffffff] text-black p-2 rounded hover:bg-[#7e2e9f] hover:text-white text-bold text-sm transition flex items-center justify-center"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        <span className="sr-only">Logout</span> 
      </button>
    </header>
  );
};

export default Header;
