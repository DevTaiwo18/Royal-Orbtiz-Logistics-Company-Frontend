// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Layout/Header';
import Vertical from './Layout/Vertical';
import Customers from './Service/Customer/Customers';
import Shipment from './Service/Shipment/Shipment';
import Receipts from './Service/Receipts/Receipts';
import Setting from './Service/Setting/Setting';
import DisplayShipment from './Service/Shipment/DisplayShipment';
import SettingPrice from './Service/Price/SettingPrice';
import ViewPrice from './Service/Price/ViewPrice';
import ViewPriceSinglePage from './Service/Price/ViewPriceSinglePage';
import UpdatePrice from './Service/Price/UpdatePrice';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 mt-20">
        <Vertical />
        <main className="flex-1 shadow-xl ml-64 p-4">
          <Routes>
            <Route path='/shipment/:id' element={<DisplayShipment />} />
            <Route path='/price/:id' element={<ViewPriceSinglePage />} />
            <Route path='/price/update/:id' element={<UpdatePrice />} />
            <Route path="/" element={<SettingPrice />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/view" element={<ViewPrice />} />
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
