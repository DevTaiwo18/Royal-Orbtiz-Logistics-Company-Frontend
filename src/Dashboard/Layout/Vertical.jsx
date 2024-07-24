// src/components/Vertical.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, TruckIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/outline';

const Vertical = () => {
  return (
    <aside className="bg-[#9333EA] text-white w-64 h-screen p-4 fixed flex flex-col">
      <nav className="flex flex-col flex-grow">
        <ul className="space-y-6 mt-5">
          <li className="flex items-center space-x-4">
            <HomeIcon className="h-6 w-6" />
            <Link to="/dashboard" className="flex-1 hover:text-gray-300">Dashboard</Link>
          </li>
          <li className="flex items-center space-x-4">
            <UserGroupIcon className="h-6 w-6" />
            <Link to="/dashboard/customer" className="flex-1 hover:text-gray-300">Customers</Link>
          </li>
          <li className="flex items-center space-x-4">
            <TruckIcon className="h-6 w-6" />
            <Link to="/dashboard/shipment" className="flex-1 hover:text-gray-300">Shipments</Link>
          </li>
          <li className="flex items-center space-x-4">
            <DocumentTextIcon className="h-6 w-6" />
            <Link to="/dashboard/receipt" className="flex-1 hover:text-gray-300">Receipts</Link>
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
