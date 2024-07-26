import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the ShipmentContext
const ShipmentContext = createContext();

// ShipmentProvider component
export const ShipmentProvider = ({ children }) => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_APP_API_URL;

    // Fetch all shipments
    const fetchShipments = async () => {
        try {
            const response = await axios.get(`${API_URL}/shipments/`);
            setShipments(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Create a new shipment
    const createShipment = async (shipment) => {
        try {
            const response = await axios.post(`${API_URL}/shipments/`, shipment);
            setShipments(prevShipments => [...prevShipments, response.data]);
        } catch (err) {
            setError(err.message);
        }
    };

    // Update an existing shipment
    const updateShipment = async (id, updatedShipment) => {
        try {
            const response = await axios.put(`${API_URL}/shipments/${id}`, updatedShipment);
            setShipments(prevShipments =>
                prevShipments.map((shipment) =>
                    shipment._id === id ? response.data : shipment
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete a shipment
    const deleteShipment = async (id) => {
        try {
            await axios.delete(`${API_URL}/shipments/${id}`);
            setShipments(prevShipments =>
                prevShipments.filter((shipment) => shipment._id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch shipments on mount
    useEffect(() => {
        fetchShipments();
    }, []);

    return (
        <ShipmentContext.Provider value={{ shipments, loading, error, createShipment, updateShipment, deleteShipment, fetchShipments }}>
            {children}
        </ShipmentContext.Provider>
    );
};

// Custom hook to use ShipmentContext
export const useShipments = () => {
    return useContext(ShipmentContext);
};