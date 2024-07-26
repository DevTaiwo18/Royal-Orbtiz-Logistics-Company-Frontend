import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get route params
import { useShipments } from '../../../context/ShipmentContext'; // Import useShipments from context

const DisplayShipment = () => {
  const { id } = useParams(); // Get the shipment ID from the URL
  const { shipments } = useShipments(); // Get shipments from context

  // Find the shipment by ID
  const shipment = shipments.find(shipment => shipment._id === id);

  if (!shipment) {
    return <p>Shipment not found</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Shipment Details</h1>
        <div className="space-y-4">
          <div>
            <strong>Waybill Number:</strong> {shipment.waybillNumber}
          </div>
          <div>
            <strong>Sender:</strong> {shipment.sender}
          </div>
          <div>
            <strong>Receiver Name:</strong> {shipment.receiverName}
          </div>
          <div>
            <strong>Receiver Address:</strong> {shipment.receiverAddress}
          </div>
          <div>
            <strong>Receiver Phone:</strong> {shipment.receiverPhone}
          </div>
          <div>
            <strong>Description:</strong> {shipment.description}
          </div>
          <div>
            <strong>Delivery Type:</strong> {shipment.deliveryType}
          </div>
          <div>
            <strong>Origin State:</strong> {shipment.originState}
          </div>
          <div>
            <strong>Destination State:</strong> {shipment.destinationState}
          </div>
          <div>
            <strong>Price:</strong> {shipment.price}
          </div>
          <div>
            <strong>Payment Method:</strong> {shipment.paymentMethod}
          </div>
          <div>
            <strong>Amount Paid:</strong> {shipment.amountPaid}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayShipment;
