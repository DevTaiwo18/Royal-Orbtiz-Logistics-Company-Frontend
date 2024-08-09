// src/components/Header.jsx
import React from 'react';
import { Logout } from '@mui/icons-material';
import logo from '../../assets/f7de514a-567b-44f4-a60b-30521f14f728-removebg-preview.png';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const Header = () => {
  const { logout } = useAuth(); // Destructure logout function from useAuth

  const handleLogout = () => {
    logout(); // Call logout function on button click
  };

  return (
    <header className="bg-white text-purple-600 p-5 flex items-center shadow-md fixed top-0 left-0 w-full z-50">
      <img src={logo} alt="Company Logo" className="h-10" />
      <button
        onClick={handleLogout} // Attach the handleLogout function to the onClick event
        className="ml-auto p-2 text-purple-600 hover:bg-purple-100 rounded shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <Logout className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;
