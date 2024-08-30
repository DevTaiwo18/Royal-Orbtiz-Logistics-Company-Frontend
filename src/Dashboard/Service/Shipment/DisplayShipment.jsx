import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShipments } from '../../../context/ShipmentContext';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

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
        window.location.reload();
        // Navigate back to the shipment list page
    };

    // Format currency with ₦
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (shipmentError) return <p className="text-center text-red-600">Shipment Error: {shipmentError}</p>;
    if (!shipment) return <p className="text-center text-gray-600">Shipment not found</p>;

    return (
        <div className="p-3 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 flex items-center transition duration-300 ease-in-out"
                    >
                        <FaArrowLeft className="mr-2" style={{ textTransform: 'uppercase' }} /> Back
                    </button>
                </div>
                <h1 className="text-3xl font-bold mb-6 text-gray-800" style={{ textTransform: 'uppercase' }}>Shipment Details</h1>
                <div className="space-y-6">
                    {[
                        { label: 'Waybill Number', value: shipment.waybillNumber },
                        { label: 'Sender Name', value: shipment.senderName },
                        { label: 'Receiver Name', value: shipment.receiverName },
                        { label: 'Receiver Address', value: shipment.receiverAddress },
                        { label: 'Receiver Phone', value: shipment.receiverPhone },
                        { label: 'Description', value: shipment.description },
                        { label: 'Delivery Type', value: shipment.deliveryType },
                        { label: 'Origin State', value: shipment.originState },
                        { label: 'Destination State', value: shipment.destinationState },
                        { label: 'Price', value: formatCurrency(shipment.totalPrice) },
                        { label: 'Paid Amount', value: formatCurrency(shipment.amountPaid) }
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="font-semibold text-gray-800" style={{ textTransform: 'uppercase' }}>{item.label}:</span>
                            <span className="text-gray-800 font-bold" style={{ textTransform: 'uppercase' }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DisplayShipment;
