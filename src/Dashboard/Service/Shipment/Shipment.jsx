import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../../context/CustomerContext';
import { usePrices } from '../../../context/PriceContext';
import { useShipments } from '../../../context/ShipmentContext'; // Import ShipmentContext

const Shipment = () => {
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryType, setDeliveryType] = useState('hubToHub');
  const [originState, setOriginState] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [weight, setWeight] = useState('');
  const [name, setName] = useState(''); // Updated from `category` to `name`
  const [insurance, setInsurance] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default value
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();
  const { fetchCustomerByPhone } = useCustomers();
  const { calculatePrice } = usePrices();
  const { createShipment } = useShipments(); // Get the createShipment function from context

  const handlePhoneNumberBlur = async () => {
    if (senderPhoneNumber) {
      try {
        const customers = await fetchCustomerByPhone(senderPhoneNumber);
        if (customers.length > 0) {
          const { name } = customers[0];
          setSenderName(name);
        } else {
          setSenderName('');
          navigate('/dashboard/customer');
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        setSenderName('');
        navigate('/dashboard/customer');
      }
    }
  };

  const handleCalculatePrice = async () => {
    setLoading(true);
    const shipmentDetails = {
      deliveryType,
      originState,
      destinationState,
      weight: parseFloat(weight),
      name, // Updated from `category` to `name`
      insurance
    };

    try {
      const price = await calculatePrice(shipmentDetails);
      console.log(price);

      setTotalPrice(price);
    } catch (error) {
      console.error('Error calculating price:', error);
      setTotalPrice(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const shipmentDetails = {
      senderName,
      senderPhoneNumber,
      receiverName,
      receiverAddress,
      receiverPhone,
      description,
      deliveryType,
      originState,
      destinationState,
      weight: parseFloat(weight),
      name, // Updated from `category` to `name`
      insurance,
      totalPrice,
      paymentMethod,
      amountPaid: parseFloat(amountPaid)
    };

    console.log(shipmentDetails);
    

    try {
      const createdShipment = await createShipment(shipmentDetails);
      
      navigate(`/dashboard/shipment/${createdShipment._id}`);
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return 'N/A';
    return `₦${amount.toLocaleString()}`;
  };

  // Sample names
  const names = [
    'Document',
    'Cargo',
    'Parcel',
  ];

  return (
    <div className="p-6 bg-white shadow-2xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shipment Details</h1>
      <form className="space-y-8 bg-white p-6 rounded-lg">
        {/* Sender and Receiver Information */}
        <div className="flex gap-8 mb-8">
          {/* Sender Information */}
          <div className="flex-1 p-6 bg-gray-50 border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sender Information</h2>
            <div className="mb-4">
              <label htmlFor="senderPhoneNumber" className="block text-gray-600 text-lg font-semibold">Sender Phone Number</label>
              <input
                type="text"
                id="senderPhoneNumber"
                value={senderPhoneNumber}
                onChange={(e) => setSenderPhoneNumber(e.target.value)}
                onBlur={handlePhoneNumberBlur}
                placeholder="Enter phone number"
                className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="senderName" className="block text-gray-600 text-lg font-semibold">Sender Name</label>
              <input
                type="text"
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Sender's Name"
                className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
                readOnly
              />
            </div>
          </div>

          {/* Receiver Information */}
          <div className="flex-1 p-6 bg-gray-50 border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Receiver Information</h2>
            <div className="mb-4">
              <label htmlFor="receiverName" className="block text-gray-600 text-lg font-semibold">Receiver Name</label>
              <input
                type="text"
                id="receiverName"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Receiver's Name"
                className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="receiverAddress" className="block text-gray-600 text-lg font-semibold">Receiver Address</label>
              <input
                type="text"
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Receiver's Address"
                className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="receiverPhone" className="block text-gray-600 text-lg font-semibold">Receiver Phone Number</label>
              <input
                type="text"
                id="receiverPhone"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="Receiver's Phone Number"
                className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-600 text-lg font-semibold">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of the shipment"
            className="mt-1 p-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100 uppercase"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="deliveryType" className="block text-gray-600 text-lg font-semibold">Delivery Type</label>
          <select
            id="deliveryType"
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          >
            <option value="hubToHub">Hub to Hub</option>
            <option value="officeToHub">Office to Hub</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="originState" className="block text-gray-600 text-lg font-semibold">Origin State</label>
          <input
            type="text"
            id="originState"
            value={originState}
            onChange={(e) => setOriginState(e.target.value)}
            placeholder="Origin State"
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="destinationState" className="block text-gray-600 text-lg font-semibold">Destination State</label>
          <input
            type="text"
            id="destinationState"
            value={destinationState}
            onChange={(e) => setDestinationState(e.target.value)}
            placeholder="Destination State"
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="weight" className="block text-gray-600 text-lg font-semibold">Weight</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 text-lg font-semibold">Name</label>
          <select
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          >
            <option value="" disabled>Select Name</option>
            {names.map((nameOption) => (
              <option key={nameOption} value={nameOption}>{nameOption}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="insurance" className="flex items-center text-gray-600 text-lg font-semibold">
            <input
              type="checkbox"
              id="insurance"
              checked={insurance}
              onChange={() => setInsurance(!insurance)}
              className="mr-2"
            />
            Insurance
          </label>
        </div>

        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={handleCalculatePrice}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600 focus:outline-none"
          >
            {loading ? 'Calculating...' : 'Calculate Price'}
          </button>
        </div>

        <div className="mt-8">
          <label htmlFor="totalPrice" className="block text-gray-600 text-lg font-semibold">Total Price</label>
          <input
            type="text"
            id="totalPrice"
            value={formatCurrency(totalPrice)}
            placeholder="Total Price"
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none bg-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>

        {totalPrice != null && (
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-gray-600 text-lg font-semibold">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            >
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        )}

        {totalPrice != null && (
          <div className="mb-4">
            <label htmlFor="amountPaid" className="block text-gray-600 text-lg font-semibold">Amount Paid</label>
            <input
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Amount Paid"
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        )}

        {totalPrice != null && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default Shipment;
