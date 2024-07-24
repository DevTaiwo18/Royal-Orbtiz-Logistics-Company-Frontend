// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Layout/Header';
import Vertical from './Layout/Vertical';
import Dashboardindex from './Component/Dashboard_index';
import Customers from './Service/Customer/Customers';
import Shipment from './Service/Shipment/Shipment';
import Receipts from './Service/Receipts/Receipts';
import Setting from './Service/Setting/Setting';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Vertical />
        <main className="flex-1 ml-64 p-4">
          <Routes>
            <Route path="/" element={<Dashboardindex />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/shipment" element={<Shipment />} />
            <Route path="/receipt" element={<Receipts />} />
            <Route path="/settings" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
