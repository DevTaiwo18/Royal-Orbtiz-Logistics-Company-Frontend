import React, { useState, useEffect } from 'react';
import { useRiders } from '../../../context/RiderContext'; // Importing RiderContext for context API
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing Font Awesome icons

const Rider = () => {
    // State for form inputs and management
    const [riderName, setRiderName] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('Bike'); // Default vehicle type
    const [editMode, setEditMode] = useState(false);
    const [currentRiderId, setCurrentRiderId] = useState(null);
    const { riders, fetchRiders, createRider, deleteRider, updateRider } = useRiders();

    useEffect(() => {
        fetchRiders(); // Fetch riders when the component mounts
    }, [fetchRiders]);

    // Handles form submission for creating/updating a rider
    const handleSubmit = async (e) => {
        e.preventDefault();
        const riderData = {
            riderName,
            vehicleModel,
            vehiclePlateNumber,
            contactNumber,
            vehicleType,
        };

        try {
            if (editMode) {
                await updateRider(currentRiderId, riderData); // Update existing rider
            } else {
                await createRider(riderData); // Create new rider
            }
            resetForm(); // Reset form after successful operation
            fetchRiders(); // Refresh rider list
        } catch (error) {
            console.error('Error saving rider:', error);
        }
    };

    // Resets the form fields to their initial state
    const resetForm = () => {
        setRiderName('');
        setVehicleModel('');
        setVehiclePlateNumber('');
        setContactNumber('');
        setVehicleType('Bike');
        setEditMode(false);
        setCurrentRiderId(null);
    };

    // Populates the form fields with data from a selected rider for editing
    const handleEdit = (rider) => {
        setEditMode(true);
        setCurrentRiderId(rider._id);
        setRiderName(rider.riderName);
        setVehicleModel(rider.vehicleModel);
        setVehiclePlateNumber(rider.vehiclePlateNumber);
        setContactNumber(rider.contactNumber);
        setVehicleType(rider.vehicleType);
    };

    return (
        <div className="p-6 bg-white shadow-2xl min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Rider Management</h1>
            <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
                <div className="flex gap-8">
                    <div className="flex-1">
                        <label className="block text-gray-600 text-lg font-semibold">Rider Name</label>
                        <input
                            type="text"
                            value={riderName}
                            onChange={(e) => setRiderName(e.target.value)}
                            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 text-lg font-semibold">Vehicle Model</label>
                        <input
                            type="text"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-1">
                        <label className="block text-gray-600 text-lg font-semibold">License Plate</label>
                        <input
                            type="text"
                            value={vehiclePlateNumber}
                            onChange={(e) => setVehiclePlateNumber(e.target.value)}
                            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 text-lg font-semibold">Contact Number</label>
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-1">
                        <label className="block text-gray-600 text-lg font-semibold">Vehicle Type</label>
                        <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                            required
                        >
                            <option value="Bike">Bike</option>
                            <option value="Motorcycle">Motorcycle</option>
                            <option value="Van">Van</option>
                            <option value="Truck">Truck</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
                >
                    {editMode ? 'Update Rider' : 'Add Rider'}
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Existing Riders</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
                {riders.length === 0 ? (
                    <p className="text-gray-600">No rider records available.</p>
                ) : (
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                            <tr className="text-center">
                                <th className="py-2 px-4 uppercase">Rider Name</th>
                                <th className="py-2 px-4 uppercase">Vehicle Model</th>
                                <th className="py-2 px-4 uppercase">License Plate</th>
                                <th className="py-2 px-4 uppercase">Contact Number</th>
                                <th className="py-2 px-4 uppercase">Vehicle Type</th>
                                <th className="py-2 px-4 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map((rider) => (
                                <tr key={rider._id} className="border-t text-center text-xs">
                                    <td className="py-2 px-4">{rider.riderName}</td>
                                    <td className="py-2 px-4">{rider.vehicleModel}</td>
                                    <td className="py-2 px-4">{rider.vehiclePlateNumber}</td>
                                    <td className="py-2 px-4">{rider.contactNumber}</td>
                                    <td className="py-2 px-4">{rider.vehicleType}</td>
                                    <td className="py-2 px-4 flex justify-center gap-4">
                                        <button
                                            onClick={() => handleEdit(rider)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteRider(rider._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Rider;
