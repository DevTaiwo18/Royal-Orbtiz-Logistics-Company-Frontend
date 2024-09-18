// src/context/ShipmentContext.jsx
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
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/shipments/`);
            setShipments(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a single shipment by ID
    const fetchShipmentById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/shipments/${id}`);
            return response.data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // Fetch a shipment by Waybill Number
    const fetchShipmentByWaybillNumber = async (waybillNumber) => {
        try {
            console.log(`Fetching shipment for waybill number: ${waybillNumber}`);
            const response = await axios.get(`${API_URL}/shipments/waybill/${waybillNumber.trim()}`);
            console.log('Response:', response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error('Error fetching shipment:', err);
            return null;
        }
    };

    // Create a new shipment
    const createShipment = async (shipment) => {
        try {
            const response = await axios.post(`${API_URL}/shipments/`, shipment);
            setShipments(prevShipments => [...prevShipments, response.data]);
            return response.data;
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
        <ShipmentContext.Provider value={{
            shipments, loading, error, createShipment, updateShipment, 
            deleteShipment, fetchShipments, fetchShipmentById, 
            fetchShipmentByWaybillNumber
        }}>
            {children}
        </ShipmentContext.Provider>
    );
};

// Custom hook to use ShipmentContext
export const useShipments = () => {
    return useContext(ShipmentContext);
};
