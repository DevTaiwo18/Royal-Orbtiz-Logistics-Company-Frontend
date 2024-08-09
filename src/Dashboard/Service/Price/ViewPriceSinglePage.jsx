import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrices } from '../../../context/PriceContext'; // Adjust the import path as needed
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'; // Icons for edit, delete, and back

const ViewPriceSinglePage = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const { singlePrice, loading, error, fetchPriceById, deletePrice } = usePrices();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchPriceById(id); // Fetch the price by ID
    };
    fetchData();
  }, [id, fetchPriceById]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      await deletePrice(id);
      navigate('/dashboard/prices'); // Redirect to the list page after deletion
    }
  };

  const handleUpdate = () => {
    navigate(`/dashboard/price/update/${id}`); // Redirect to the update page
  };

  const handleBack = () => {
    navigate('/dashboard/view'); // Navigate back to the specified route
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!singlePrice) return <div className="text-center text-gray-600">Price not found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 flex items-center transition duration-300 ease-in-out"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Price Details</h1>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-700">{singlePrice.categories[0]?.name}</h2>
        <div className="text-gray-600 space-y-4">
          <p><strong>Base Price:</strong> ${singlePrice.categories[0]?.basePrice.toFixed(2)}</p>
          <p><strong>Insurance Charge:</strong> ${singlePrice.categories[0]?.insuranceCharge.toFixed(2)}</p>
          <div>
            <strong>Weight Charges:</strong>
            <ul className="list-disc ml-5 space-y-1">
              {singlePrice.categories[0]?.weightCharges.map((charge, index) => (
                <li key={index}>
                  {charge.range}: ${charge.charge}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Delivery Charges:</strong>
            <ul className="list-disc ml-5 space-y-1">
              {singlePrice.categories[0]?.deliveryCharges.map((charge, index) => (
                <li key={index}>
                  {charge.type}: ${charge.charge}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Delivery Scope Charges:</strong>
            <ul className="list-disc ml-5 space-y-1">
              {singlePrice.categories[0]?.deliveryScopeCharges.map((charge, index) => (
                <li key={index}>
                  {charge.scope}: ${charge.charge}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleUpdate}
            className="px-5 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 flex items-center transition duration-300 ease-in-out"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 flex items-center transition duration-300 ease-in-out"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPriceSinglePage;
