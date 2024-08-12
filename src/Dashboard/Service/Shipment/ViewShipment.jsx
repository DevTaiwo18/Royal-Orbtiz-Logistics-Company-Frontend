import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../../../context/ShipmentContext';

const ViewShipment = () => {
  const { shipments, loading, error, updateShipment } = useShipments();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleViewClick = (shipmentId) => {
    navigate(`/dashboard/shipment/${shipmentId}`);
  };

  console.log(shipments);
  

  const handleStatusChange = (shipmentId, status) => {
    setEditingId(shipmentId);
    setNewStatus(status);
  };

  const handleStatusUpdate = async (shipmentId) => {
    await updateShipment(shipmentId, { status: newStatus });
    setEditingId(null);
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shipments List</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600">
            <th className="py-2 px-4 border-b">Sender Name</th>
            <th className="py-2 px-4 border-b">Receiver Name</th>
            <th className="py-2 px-4 border-b">Waybill Number</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{shipment.senderName}</td>
              <td className="py-2 px-4 border-b">{shipment.receiverName}</td>
              <td className="py-2 px-4 border-b">{shipment.waybillNumber}</td>
              <td className="py-2 px-4 border-b">
                {editingId === shipment._id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="p-1 border border-gray-300 rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(shipment._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{shipment.status}</span>
                    <button
                      onClick={() => handleStatusChange(shipment._id, shipment.status)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleViewClick(shipment._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewShipment;
