import React, { useState, useEffect } from 'react';
import { useShipments } from '../../../context/ShipmentContext';
import { useCustomers } from '../../../context/CustomerContext';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

// Helper function to format price with commas
const formatNumberWithCommas = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to format price
const formatPrice = (amount) => {
  if (!amount) return '₦0.00';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

const Shipment = () => {
  const { shipments, createShipment, fetchShipments } = useShipments();
  const { customers } = useCustomers();
  const [formData, setFormData] = useState({
    sender: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    description: '',
    deliveryType: '',
    originState: '',
    destinationState: '',
    price: '',
    paymentMethod: '',
    amountPaid: ''
  });
  const [senderDetails, setSenderDetails] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  const navigate = useNavigate();

  useEffect(() => {
    const selectedSender = customers.find(customer => customer._id === formData.sender);
    setSenderDetails(selectedSender || null);
  }, [formData.sender, customers]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchShipments(); // Fetch the latest shipments
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format the value if it's price or amountPaid
    if (name === 'price' || name === 'amountPaid') {
      const formattedValue = formatNumberWithCommas(value.replace(/,/g, ''));
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove commas before sending data to backend
      const formattedData = {
        ...formData,
        price: formData.price.replace(/,/g, ''),
        amountPaid: formData.amountPaid.replace(/,/g, '')
      };
      await createShipment(formattedData);
      setFormData({
        sender: '',
        receiverName: '',
        receiverAddress: '',
        receiverPhone: '',
        description: '',
        deliveryType: '',
        originState: '',
        destinationState: '',
        price: '',
        paymentMethod: '',
        amountPaid: ''
      });
      setIsFormVisible(false);
      setRefreshKey(prev => prev + 1); // Increment refresh key to trigger re-render
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const senderName = shipment.senderName?.toLowerCase() || '';
    const receiverName = shipment.receiverName?.toLowerCase() || '';
    const waybillNumber = shipment.waybillNumber?.toLowerCase() || '';

    const searchTermLower = searchTerm.toLowerCase();

    return senderName.includes(searchTermLower) ||
      receiverName.includes(searchTermLower) ||
      waybillNumber.includes(searchTermLower);
  });

  const handleView = (id) => {
    navigate(`/shipment/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Shipments</h1>

        <div className="flex justify-between items-center mb-6">
          <input
            className="p-2 outline-none border border-gray-300 rounded-lg w-full max-w-md"
            type="text"
            placeholder="Search shipments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-4">
            <button
              className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700"
              onClick={() => setIsFormVisible(prev => !prev)}
            >
              {isFormVisible ? 'Cancel' : 'Create Shipment'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {isFormVisible && !loading && (
          <div className="bg-white p-6 rounded-lg ">
            <h2 className="text-lg font-semibold mb-6">Add New Shipment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="sender">
                    Sender:
                  </label>
                  <select
                    id="sender"
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="">Select Sender</option>
                    {customers.map(customer => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="receiverName">
                    Receiver Name:
                  </label>
                  <input
                    type="text"
                    id="receiverName"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="receiverAddress">
                    Receiver Address:
                  </label>
                  <input
                    type="text"
                    id="receiverAddress"
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="receiverPhone">
                    Receiver Phone:
                  </label>
                  <input
                    type="text"
                    id="receiverPhone"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="description">
                    Description:
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="deliveryType">
                    Delivery Type:
                  </label>
                  <select
                    id="deliveryType"
                    name="deliveryType"
                    value={formData.deliveryType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="">Select Delivery Type</option>
                    <option value="Home Delivery">Home</option>
                    <option value="Office Pickup">Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="originState">
                    Origin State:
                  </label>
                  <input
                    type="text"
                    id="originState"
                    name="originState"
                    value={formData.originState}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="destinationState">
                    Destination State:
                  </label>
                  <input
                    type="text"
                    id="destinationState"
                    name="destinationState"
                    value={formData.destinationState}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="price">
                    Price (₦):
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="paymentMethod">
                    Payment Method:
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="amountPaid">
                    Amount Paid (₦):
                  </label>
                  <input
                    type="text"
                    id="amountPaid"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Shipment List</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className=''>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Waybill Number</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShipments.map(shipment => (
                <tr key={shipment._id} className='text-center'>
                  <td className="font-semibold text-xs px-4 border-b border-gray-300">{shipment.waybillNumber}</td>
                  <td className="font-semibold text-xs px-4 border-b border-gray-300">{shipment.senderName}</td>
                  <td className=" font-semibold text-xs px-4 border-b border-gray-300">{shipment.receiverName}</td>
                  <td className="font-semibold text-xs px-4 border-b border-gray-300">{formatPrice(shipment.price)}</td>
                  <td className="font-semibold text-xs px-4 border-b border-gray-300">{formatPrice(shipment.amountPaid)}</td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleView(shipment._id)}
                      className="bg-purple-500 text-white py-1 px-3 text-xs font-bold rounded-lg hover:bg-purple-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shipment;
