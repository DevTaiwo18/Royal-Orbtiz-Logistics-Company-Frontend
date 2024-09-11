import React, { useEffect } from 'react';
import { usePrices } from '../../../context/PriceContext'; // Adjust the import path as needed
import { FaEye, FaTrash } from 'react-icons/fa'; // Icons for view, edit, and delete
import { useNavigate } from 'react-router-dom';

const ViewPrice = () => {
  const { prices, loading, error, deletePrice, fetchPrices } = usePrices();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching prices...');
      await fetchPrices();
      console.log('Prices fetched:', prices);
    };
    fetchData();
  }, [fetchPrices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      await deletePrice(id);
      fetchPrices(); // Refresh prices after deletion
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/price/${id}`); // Redirect to price details page
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Prices List</h1>
      {prices.length === 0 ? (
        <div className="text-center text-gray-600">No prices available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left text-gray-700">Category</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Base Price</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Insurance Charge</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price._id}>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {price.categories?.[0]?.name || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    ₦{price.categories?.[0]?.basePrice?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    ₦{price.categories?.[0]?.vatCharge?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(price._id)}
                        className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(price._id)}
                        className="px-3 py-1 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPrice;
