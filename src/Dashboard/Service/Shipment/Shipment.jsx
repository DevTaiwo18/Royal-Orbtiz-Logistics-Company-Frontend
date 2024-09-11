import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../../context/CustomerContext';
import { usePrices } from '../../../context/PriceContext';
import { useShipments } from '../../../context/ShipmentContext'; // Import ShipmentContext
import { useBranch } from '../../../context/BranchContext';

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
  const [name, setName] = useState(''); // Updated from category to name
  const [insurance, setInsurance] = useState(false);
  const [itemValue, setItemValue] = useState(''); // New state for item value
  const [insuranceAmount, setInsuranceAmount] = useState(0); // New state for insurance amount
  const [itemCondition, setItemCondition] = useState('Not Damaged or Good'); // New state for item condition
  const [totalPrice, setTotalPrice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default value
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [customerNotFound, setCustomerNotFound] = useState(false);

  const navigate = useNavigate();
  const { fetchCustomerByPhone } = useCustomers();
  const { calculatePrice, names } = usePrices(); // Get names from context
  const { createShipment } = useShipments(); // Get the createShipment function from context
  const { fetchAllBranches } = useBranch();
  const [branches, setBranches] = useState([]);
  const [BranchName, setBranch] = useState('');

  useEffect(() => {
    if (totalPrice !== null) {
      setAmountPaid(totalPrice);
    }
  }, [totalPrice]);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const allBranches = await fetchAllBranches();
        setBranches(allBranches);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    loadBranches();
  }, []);

  const handlePhoneNumberBlur = async () => {
    if (senderPhoneNumber) {
      try {
        const customer = await fetchCustomerByPhone(senderPhoneNumber);
        if (customer) {
          const { name } = customer;
          setSenderName(name);
          setCustomerNotFound(false); // Reset if customer is found
        } else {
          setSenderName('');
          setCustomerNotFound(true); // Show the error message
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        setSenderName('');
        setCustomerNotFound(true); // Show the error message
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
      name, // Updated from category to name
      insurance
    };

    try {
      const price = await calculatePrice(shipmentDetails);
      const itemValueNumber = parseFloat(itemValue) || 0;
      const calculatedInsurance = insurance ? (itemValueNumber * 0.5) / 100 : 0;
      setInsuranceAmount(calculatedInsurance);
      const total = price + calculatedInsurance;
      setTotalPrice(total);
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
      name, // Updated from category to name
      insurance,
      totalPrice,
      paymentMethod,
      amountPaid: parseFloat(amountPaid),
      BranchName,
      itemCondition // Include item condition in the submission data
    };

    console.log(shipmentDetails);

    try {
      const createdShipment = await createShipment(shipmentDetails);
      console.log(createdShipment);
      if (createdShipment) {
        navigate(`/dashboard/shipment/${createdShipment.shipment._id}`);
      }
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
              {customerNotFound && (
                <p className="text-red-500 mt-2">No customer found. Please add them first.</p>
              )}
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
            <option value="officeToHub">Office to Hub</option> {/* Corrected option */}
          </select>
        </div>

        <div className="flex gap-8 mb-8">
          {/* Origin State */}
          <div className="flex-1 mb-4">
            <label htmlFor="originState" className="block text-gray-600 text-lg font-semibold">Origin</label>
            <input
              type="text"
              id="originState"
              value={originState}
              onChange={(e) => setOriginState(e.target.value)}
              placeholder="Origin State"
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>

          {/* Destination State */}
          <div className="flex-1 mb-4">
            <label htmlFor="destinationState" className="block text-gray-600 text-lg font-semibold">Destination</label>
            <input
              type="text"
              id="destinationState"
              value={destinationState}
              onChange={(e) => setDestinationState(e.target.value)}
              placeholder="Destination State"
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        <div className="flex gap-8 mb-8">
          {/* Weight */}
          <div className="flex-1 mb-4">
            <label htmlFor="weight" className="block text-gray-600 text-lg font-semibold">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight in kilograms"
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>

          {/* Name (Category) */}
          <div className="flex-1 mb-4">
            <label htmlFor="name" className="block text-gray-600 text-lg font-semibold">Category</label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            >
              <option value="">Select Category</option>
              {names.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8 mb-8">
          {/* Item Value */}
          <div className="flex-1 mb-4">
            <label htmlFor="itemValue" className="block text-gray-600 text-lg font-semibold">Value of the Item</label>
            <input
              type="number"
              id="itemValue"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              placeholder="Enter the value of the item"
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>

          {/* Insurance Option */}
          <div className="flex-1 mb-4 mt-7">
            <label htmlFor="insurance" className="flex items-center bg-gray-100 p-2 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <input
                type="checkbox"
                id="insurance"
                checked={insurance}
                onChange={() => setInsurance(!insurance)}
                className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 rounded transition duration-150 ease-in-out"
              />
              <span className="ml-3 text-gray-700 text-lg font-medium">Include Insurance</span>
            </label>
          </div>
        </div>

        {/* Item Condition */}
        <div className="mb-4">
          <label htmlFor="itemCondition" className="block text-gray-600 text-lg font-semibold">Item Condition</label>
          <select
            id="itemCondition"
            value={itemCondition}
            onChange={(e) => setItemCondition(e.target.value)}
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          >
            <option value="Not Damaged or Good">Not Damaged or Good</option>
            <option value="Partially Damaged">Partially Damaged</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={handleCalculatePrice}
            className={`px-4 py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400' : 'bg-yellow-600 hover:bg-yellow-700'} focus:outline-none`}
            disabled={loading}
          >
            {loading ? 'Calculating Price...' : 'Calculate Price'}
          </button>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-lg font-semibold">Insurance Amount:</span>
          <span className="text-gray-800 text-lg font-semibold">{formatCurrency(insuranceAmount)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600 text-lg font-semibold">Total Price:</span>
          <span className="text-gray-800 text-lg font-semibold">{formatCurrency(totalPrice)}</span>
        </div>

        {/* Amount Paid */}
        <div className="mb-4">
          <label htmlFor="amountPaid" className="block text-gray-600 text-lg font-semibold">Amount Paid</label>
          <input
            type="text"
            id="amountPaid"
            value={amountPaid}
            readOnly
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none bg-gray-200"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block text-gray-600 text-lg font-semibold">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          >
            <option value="cash">Cash</option>
            <option value="transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="flex-1 mb-4">
          <label htmlFor="branch" className="block text-gray-600 text-lg font-semibold">Branch Name</label>
          <select
            id="branch"
            value={BranchName}
            onChange={(e) => setBranch(e.target.value)}
            className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch._id} value={`${branch.name}`}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-4 py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shipment;
