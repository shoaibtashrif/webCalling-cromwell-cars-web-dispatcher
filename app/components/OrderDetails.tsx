'use client';

import React, { useState, useEffect } from 'react';

interface BookingDetails {
  jobNumber?: string;
  passengerName?: string;
  passengerPhone?: string;
  passengerEmail?: string;
  pickup?: string;
  destination?: string;
  vehicleType?: string;
  date?: string;
  passengers?: string;
  price?: string;
  status?: string;
}

const OrderDetails: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  useEffect(() => {
    const handleBookingUpdate = (event: CustomEvent<any>) => {
      console.log(`got booking event: ${JSON.stringify(event.detail)}`);
      
      try {
        let bookingData: BookingDetails = {};
        
        if (typeof event.detail === 'string') {
          bookingData = JSON.parse(event.detail);
        } else if (typeof event.detail === 'object') {
          bookingData = event.detail;
        }

        setBookingDetails(bookingData);
      } catch (error) {
        console.error('Failed to process booking details:', error);
      }
    };

    const handleCallEnded = () => {
      setBookingDetails({});
    };

    // Listen for booking updates (you can dispatch these from your tools)
    window.addEventListener('bookingDetailsUpdated', handleBookingUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('bookingDetailsUpdated', handleBookingUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const hasBookingData = Object.keys(bookingDetails).length > 0;

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold mb-4">Booking Details</h1>
      <div className="shadow-md rounded p-4">
        {hasBookingData ? (
          <div className="space-y-3">
            {bookingDetails.jobNumber && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Job Number:</span>
                <span className="font-mono">{bookingDetails.jobNumber}</span>
              </div>
            )}
            {bookingDetails.passengerName && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Passenger:</span>
                <span>{bookingDetails.passengerName}</span>
              </div>
            )}
            {bookingDetails.passengerPhone && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Phone:</span>
                <span className="font-mono">{bookingDetails.passengerPhone}</span>
              </div>
            )}
            {bookingDetails.pickup && (
              <div className="flex flex-col">
                <span className="text-gray-400 font-mono mb-1">Pickup:</span>
                <span className="text-sm">{bookingDetails.pickup}</span>
              </div>
            )}
            {bookingDetails.destination && (
              <div className="flex flex-col">
                <span className="text-gray-400 font-mono mb-1">Destination:</span>
                <span className="text-sm">{bookingDetails.destination}</span>
              </div>
            )}
            {bookingDetails.vehicleType && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Vehicle:</span>
                <span>{bookingDetails.vehicleType}</span>
              </div>
            )}
            {bookingDetails.date && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Date/Time:</span>
                <span className="text-sm">{formatDate(bookingDetails.date)}</span>
              </div>
            )}
            {bookingDetails.passengers && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Passengers:</span>
                <span>{bookingDetails.passengers}</span>
              </div>
            )}
            {bookingDetails.price && (
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-400 font-mono">Price:</span>
                <span>{formatCurrency(bookingDetails.price)}</span>
              </div>
            )}
            {bookingDetails.status && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  bookingDetails.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  bookingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {bookingDetails.status}
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 text-base font-mono">No booking details</span>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;