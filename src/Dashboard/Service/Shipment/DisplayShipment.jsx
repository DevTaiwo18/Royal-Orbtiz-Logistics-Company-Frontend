import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useReceipts } from '../../../context/ReceiptsContext';
import { useShipments } from '../../../context/ShipmentContext';
import { Document, Page } from '@react-pdf/renderer';

const DisplayShipment = () => {
    const { id } = useParams();
    const { fetchShipmentById, error: shipmentError } = useShipments();
    const { fetchReceiptByWaybillNumber, error: receiptError, singleReceipt } = useReceipts();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShipmentAndReceipt = async () => {
            setLoading(true);
            try {
                const shipmentData = await fetchShipmentById(id);
                setShipment(shipmentData);

                if (shipmentData?.waybillNumber) {
                    await fetchReceiptByWaybillNumber(shipmentData.waybillNumber);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        getShipmentAndReceipt();
    }, [id, fetchShipmentById, fetchReceiptByWaybillNumber]);

    useEffect(() => {
        if (shipment?.waybillNumber && singleReceipt?.waybillNumber !== shipment.waybillNumber) {
            fetchReceiptByWaybillNumber(shipment.waybillNumber);
        }
    }, [shipment?.waybillNumber, singleReceipt?.waybillNumber, fetchReceiptByWaybillNumber]);

    const handlePrint = () => {
        if (!singleReceipt || !singleReceipt.pdf || !singleReceipt.pdf.data) {
            console.error('No receipt data available for printing.');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            console.error('Failed to open print window.');
            return;
        }

        const pdfData = singleReceipt.pdf.data;
        const pdfUrl = `data:application/pdf;base64,${pdfData}`;

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Receipt</title>
                <style>
                    body { margin: 0; }
                    iframe { width: 100%; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${pdfUrl}"></iframe>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (shipmentError) return <p className="text-center text-red-600">Shipment Error: {shipmentError}</p>;
    if (receiptError) return <p className="text-center text-red-600">Receipt Error: {receiptError}</p>;
    if (!shipment) return <p className="text-center text-gray-600">Shipment not found</p>;
    if (!singleReceipt) return <p className="text-center text-gray-600">Receipt not found</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Shipment Details</h1>
                <div className="space-y-6">
                    {/* Shipment Details */}
                    {[
                        { label: 'Waybill Number', value: shipment?.waybillNumber },
                        { label: 'Sender Name', value: shipment?.senderName },
                        { label: 'Receiver Name', value: shipment?.receiverName },
                        { label: 'Receiver Address', value: shipment?.receiverAddress },
                        { label: 'Receiver Phone', value: shipment?.receiverPhone },
                        { label: 'Description', value: shipment?.description },
                        { label: 'Delivery Type', value: shipment?.deliveryType },
                        { label: 'Origin State', value: shipment?.originState },
                        { label: 'Destination State', value: shipment?.destinationState },
                        { label: 'Price', value: shipment?.price },
                        { label: 'Paid Amount', value: shipment?.paidAmount }
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="font-semibold text-gray-800">{item.label}:</span>
                            <span className="text-gray-800 font-bold">{item.value}</span>
                        </div>
                    ))}

                    {/* Receipt Display */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Receipt</h2>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {singleReceipt?.pdf ? (
                                <Document
                                    file={`data:application/pdf;base64,${singleReceipt.pdf.data}`}
                                    onLoadSuccess={() => console.log('PDF loaded successfully')}
                                    onLoadError={() => console.error('Error loading PDF')}
                                >
                                    <Page pageNumber={1} />
                                </Document>
                            ) : (
                                <p className="text-gray-600">No receipt data available</p>
                            )}
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handlePrint}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayShipment;
