// src/components/Vertical.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, TruckIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/outline';

const Vertical = () => {
  return (
    <aside className="bg-[#9333EA] shadow-xl text-white w-64 h-screen p-4 fixed flex flex-col">
      <nav className="flex flex-col shadow-xl flex-grow">
        <ul className="space-y-6 mt-5">
          <li className="flex items-center space-x-4">
            <HomeIcon className="h-6 w-6" />
            <Link to="/dashboard" className="flex-1 hover:text-gray-300">Setting Of Price</Link>
          </li>
          <li className="flex items-center space-x-4">
            <HomeIcon className="h-6 w-6" />
            <Link to="/dashboard/view" className="flex-1 hover:text-gray-300">View Prices</Link>
          </li>
          <li className="flex items-center space-x-4">
            <UserGroupIcon className="h-6 w-6" />
            <Link to="/dashboard/customer" className="flex-1 hover:text-gray-300">Customers</Link>
          </li>
          <li className="flex items-center space-x-4">
            <UserGroupIcon className="h-6 w-6" />
            <Link to="/dashboard/branch" className="flex-1 hover:text-gray-300">Branch</Link>
          </li>
          <li className="flex items-center space-x-4">
            <TruckIcon className="h-6 w-6" />
            <Link to="/dashboard/shipment" className="flex-1 hover:text-gray-300">Shipments</Link>
          </li>
          <li className="flex items-center space-x-4">
            <TruckIcon className="h-6 w-6" />
            <Link to="/dashboard/viewshipment" className="flex-1 hover:text-gray-300">View Shipment</Link>
          </li>
          <li className="flex items-center space-x-4">
            <CogIcon className="h-6 w-6" />
            <Link to="/dashboard/settings" className="flex-1 hover:text-gray-300">Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="mt-4">
      </div>
    </aside>
  );
};

export default Vertical;
