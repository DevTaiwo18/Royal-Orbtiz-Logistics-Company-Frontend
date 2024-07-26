import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useShipments } from '../../../context/ShipmentContext';

const DisplayShipment = () => {
  const { id } = useParams();
  const { fetchShipmentById, error } = useShipments();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getShipment = async () => {
      setLoading(true);
      try {
        const data = await fetchShipmentById(id);
        setShipment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getShipment();
  }, [id, fetchShipmentById]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!shipment) return <p className="text-center text-gray-600">Shipment not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shipment Details</h1>
        <div className="space-y-6">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Waybill Number:</span>
            <span className="text-gray-800 text-bold">{shipment.waybillNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Sender Name:</span>
            <span className="text-gray-800 text-bold">{shipment.senderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Receiver Name:</span>
            <span className="text-gray-800 text-bold">{shipment.receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Receiver Address:</span>
            <span className="text-gray-800 text-bold">{shipment.receiverAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Receiver Phone:</span>
            <span className="text-gray-800 text-bold">{shipment.receiverPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Description:</span>
            <span className="text-gray-800 text-bold">{shipment.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Delivery Type:</span>
            <span className="text-gray-800 text-bold">{shipment.deliveryType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Origin State:</span>
            <span className="text-gray-800 text-bold">{shipment.originState}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Destination State:</span>
            <span className="text-gray-800 text-bold">{shipment.destinationState}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Price:</span>
            <span className="text-gray-800 text-bold">{shipment.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Payment Method:</span>
            <span className="text-gray-800 text-bold">{shipment.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Amount Paid:</span>
            <span className="text-gray-800 text-bold">{shipment.amountPaid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayShipment;
