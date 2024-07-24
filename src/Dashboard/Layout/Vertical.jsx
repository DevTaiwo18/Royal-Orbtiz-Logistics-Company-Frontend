// src/components/Vertical.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, TruckIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/outline';

const Vertical = () => {
  return (
    <aside className="bg-[#9333EA] text-white w-64 h-screen p-4 fixed">
      <nav>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6" />
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </li>
          <li className="flex items-center space-x-2">
            <UserGroupIcon className="h-6 w-6" />
            <Link to="/dashboard/customer" className="hover:underline">Customers</Link>
          </li>
          <li className="flex items-center space-x-2">
            <TruckIcon className="h-6 w-6" />
            <Link to="/dashboard/shipment" className="hover:underline">Shipments</Link>
          </li>
          <li className="flex items-center space-x-2">
            <DocumentTextIcon className="h-6 w-6" />
            <Link to="/dashboard/receipt" className="hover:underline">Receipts</Link>
          </li>
          <li className="flex items-center space-x-2">
            <CogIcon className="h-6 w-6" />
            <Link to="/dashboard/settings" className="hover:underline">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Vertical;
