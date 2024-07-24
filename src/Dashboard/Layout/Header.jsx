// src/components/Header.jsx
import React from 'react';
import { Logout } from '@mui/icons-material';
import logo from '../../assets/f7de514a-567b-44f4-a60b-30521f14f728-removebg-preview.png';

const Header = () => {
  return (
    <header className="bg-white text-purple-600 p-4 flex items-center shadow-md">
      <img src={logo} alt="Logo" className="h-10" />
      <button className="ml-auto p-2 text-purple-600 hover:bg-purple-100 rounded shadow-sm hover:shadow-md transition-shadow duration-300">
        <Logout className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;
