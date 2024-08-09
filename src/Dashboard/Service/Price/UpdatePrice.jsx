import React, { useEffect, useState } from 'react';
import { usePrices } from '../../../context/PriceContext'; // Adjust the import path as needed
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa'; // Import the Back icon

const UpdatePrice = () => {
    const { id } = useParams(); // Get the id from URL params
    const { fetchPriceById, singlePrice, updatePrice, error } = usePrices();
    const [categoryName, setCategoryName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [insuranceCharge, setInsuranceCharge] = useState('');
    const [weightCharges, setWeightCharges] = useState([{ range: '', charge: '' }]);
    const [deliveryCharges, setDeliveryCharges] = useState([{ type: '', charge: '' }]);
    const [deliveryScopeCharges, setDeliveryScopeCharges] = useState([{ scope: '', charge: '' }]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPrice = async () => {
            try {
                await fetchPriceById(id);
                console.log('Fetched price:', singlePrice); // Check if singlePrice is set
                if (singlePrice) {
                    setCategoryName(singlePrice.categories[0]?.name || '');
                    setBasePrice(singlePrice.categories[0]?.basePrice || '');
                    setInsuranceCharge(String(singlePrice.categories[0]?.insuranceCharge || ''));
                    setWeightCharges(singlePrice.categories[0]?.weightCharges || [{ range: '', charge: '' }]);
                    setDeliveryCharges(singlePrice.categories[0]?.deliveryCharges || [{ type: '', charge: '' }]);
                    setDeliveryScopeCharges(singlePrice.categories[0]?.deliveryScopeCharges || [{ scope: '', charge: '' }]);
                }
            } catch (error) {
                console.error('Error fetching price:', error);
            }
        };

        loadPrice();
    }, [id, fetchPriceById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedPrice = {
            categories: [{
                name: categoryName,
                basePrice: parseFloat(basePrice.replace(/,/g, '')),
                insuranceCharge: parseFloat(String(insuranceCharge).replace(/,/g, '')),
                weightCharges: weightCharges.map(wc => ({
                    range: wc.range,
                    charge: parseFloat(String(wc.charge ?? '').replace(/,/g, '')) // Ensure wc.charge is a string
                })),
                deliveryCharges: deliveryCharges.map(dc => ({
                    type: dc.type,
                    charge: parseFloat(String(dc.charge ?? '').replace(/,/g, '')) // Ensure dc.charge is a string
                })),
                deliveryScopeCharges: deliveryScopeCharges.map(dsc => ({
                    scope: dsc.scope,
                    charge: parseFloat(String(dsc.charge ?? '').replace(/,/g, '')) // Ensure dsc.charge is a string
                }))
            }]
        };

        try {
            await updatePrice(id, updatedPrice);
            toast.success('Price updated successfully!');
            navigate('/dashboard/view'); // Redirect after successful update
        } catch (err) {
            toast.error('Failed to update price. Please try again.');
        }
    };


    const handleBack = () => {
        navigate('/dashboard/view'); // Navigate back to the specified route
    };

    if (error) return <p className="text-red-500">Error: {error.message}</p>;
    if (singlePrice === undefined) return <p>Loading...</p>;
    if (singlePrice === null) return <p>No data found</p>; // Handle the case when data is not found

    return (
        <div className="p-4 border rounded shadow-md">
            <div className="mb-4">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 flex items-center transition duration-300 ease-in-out"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Update Price</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Base Price</label>
                    <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Charge</label>
                    <input
                        type="text"
                        value={insuranceCharge}
                        onChange={(e) => setInsuranceCharge(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Weight Charges</label>
                    {weightCharges.map((wc, index) => (
                        <div key={index} className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Range"
                                value={wc.range}
                                onChange={(e) => {
                                    const newWeightCharges = [...weightCharges];
                                    newWeightCharges[index].range = e.target.value;
                                    setWeightCharges(newWeightCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Charge"
                                value={wc.charge}
                                onChange={(e) => {
                                    const newWeightCharges = [...weightCharges];
                                    newWeightCharges[index].charge = e.target.value;
                                    setWeightCharges(newWeightCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Charges</label>
                    {deliveryCharges.map((dc, index) => (
                        <div key={index} className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Type"
                                value={dc.type}
                                onChange={(e) => {
                                    const newDeliveryCharges = [...deliveryCharges];
                                    newDeliveryCharges[index].type = e.target.value;
                                    setDeliveryCharges(newDeliveryCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Charge"
                                value={dc.charge}
                                onChange={(e) => {
                                    const newDeliveryCharges = [...deliveryCharges];
                                    newDeliveryCharges[index].charge = e.target.value;
                                    setDeliveryCharges(newDeliveryCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Scope Charges</label>
                    {deliveryScopeCharges.map((dsc, index) => (
                        <div key={index} className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Scope"
                                value={dsc.scope}
                                onChange={(e) => {
                                    const newDeliveryScopeCharges = [...deliveryScopeCharges];
                                    newDeliveryScopeCharges[index].scope = e.target.value;
                                    setDeliveryScopeCharges(newDeliveryScopeCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Charge"
                                value={dsc.charge}
                                onChange={(e) => {
                                    const newDeliveryScopeCharges = [...deliveryScopeCharges];
                                    newDeliveryScopeCharges[index].charge = e.target.value;
                                    setDeliveryScopeCharges(newDeliveryScopeCharges);
                                }}
                                className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
                    Update Price
                </button>
            </form>
        </div>
    );
};

export default UpdatePrice;
