import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShipments } from '../../../context/ShipmentContext';
import { FaArrowLeft } from 'react-icons/fa';

const DisplayShipment = () => {
  const { id } = useParams();
  const { fetchShipmentById, error: shipmentError } = useShipments();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getShipment = async () => {
    setLoading(true);
    try {
      const shipmentData = await fetchShipmentById(id);
      setShipment(shipmentData);
    } catch (err) {
      console.error('Error fetching shipment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShipment();
  }, [id, fetchShipmentById]);

  const handleBack = () => {
    navigate('/dashboard/viewshipment');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (shipmentError) return <p className="text-center text-red-600">Shipment Error: {shipmentError}</p>;
  if (!shipment) return <p className="text-center text-gray-600">Shipment not found</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center uppercase tracking-wide">
          Shipment Details
        </h1>

        {/* Waybill Section */}
        <section id="waybill-section" className="mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">Waybill Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <Detail label="Waybill Number" value={shipment.waybillNumber} />
            <Detail label="Delivery Type" value={shipment.deliveryType} />
          </div>
        </section>

        {/* Sender and Receiver Information */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">Sender and Receiver Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <Detail label="Sender Name" value={shipment.senderName} />
            <Detail label="Sender Phone" value={shipment.senderPhoneNumber} />
            <Detail label="Receiver Name" value={shipment.receiverName} />
            <Detail label="Receiver Address" value={shipment.receiverAddress} />
            <Detail label="Receiver Phone" value={shipment.receiverPhone} />
          </div>
        </section>

        {/* Shipment Details */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">Shipment Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <Detail label="Origin State" value={shipment.originState} />
            <Detail label="Destination State" value={shipment.destinationState} />
            <Detail label="Description" value={shipment.description} />
            <Detail label="Branch Name" value={shipment.BranchName} />
            <Detail label="Status" value={shipment.status} />
          </div>
        </section>

        {/* Financial Information */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">Financial Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <Detail label="Total Price" value={formatCurrency(shipment.totalPrice)} />
            <Detail label="Amount Paid" value={formatCurrency(shipment.amountPaid)} />
            <Detail label="Payment Method" value={shipment.paymentMethod} />
            <Detail label="Insurance Amount" value={formatCurrency(shipment.insurance)} />
          </div>
        </section>

        {/* Additional Information */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">Additional Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <Detail label="Item Condition" value={shipment.itemCondition} />
            <Detail label="Rider" value={shipment.rider?.riderName || 'N/A'} />
            <Detail label="Created By" value={shipment.createdBy?.employeeName || 'N/A'} />
            <Detail label="Document ID" value={shipment.documentId} />
            <Detail label="Created At" value={new Date(shipment.createdAt).toLocaleDateString()} />
          </div>
        </section>
      </div>
    </div>
  );
};

// Reusable Detail Component for displaying label and value pairs
const Detail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-semibold text-gray-700 uppercase">{label}:</span>
    <span className="text-gray-600 font-medium">{value}</span>
  </div>
);

export default DisplayShipment;
