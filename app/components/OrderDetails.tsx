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
    <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 animate-pulse"></div>
        Booking Details
      </h2>
      
      {hasBookingData ? (
        <div className="space-y-4">
          {bookingDetails.jobNumber && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Job Number:</span>
                <span className="font-mono text-white bg-purple-500/20 px-2 py-1 rounded text-sm">
                  {bookingDetails.jobNumber}
                </span>
              </div>
            </div>
          )}
          
          {bookingDetails.passengerName && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passenger:</span>
              <span className="text-white font-medium">{bookingDetails.passengerName}</span>
            </div>
          )}
          
          {bookingDetails.passengerPhone && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Phone:</span>
              <span className="text-white font-mono text-sm">{bookingDetails.passengerPhone}</span>
            </div>
          )}
          
          {bookingDetails.pickup && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-gray-300 text-sm block mb-1">📍 Pickup Location:</span>
              <span className="text-white text-sm">{bookingDetails.pickup}</span>
            </div>
          )}
          
          {bookingDetails.destination && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-gray-300 text-sm block mb-1">🎯 Destination:</span>
              <span className="text-white text-sm">{bookingDetails.destination}</span>
            </div>
          )}
          
          {bookingDetails.vehicleType && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Vehicle:</span>
              <span className="text-white bg-blue-500/20 px-2 py-1 rounded text-sm">
                {bookingDetails.vehicleType}
              </span>
            </div>
          )}
          
          {bookingDetails.date && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Date/Time:</span>
              <span className="text-white text-sm">{formatDate(bookingDetails.date)}</span>
            </div>
          )}
          
          {bookingDetails.passengers && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Passengers:</span>
              <span className="text-white">{bookingDetails.passengers}</span>
            </div>
          )}
          
          {bookingDetails.price && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-green-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Total Price:</span>
                <span className="text-white font-bold text-lg">{formatCurrency(bookingDetails.price)}</span>
              </div>
            </div>
          )}
          
          {bookingDetails.status && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                bookingDetails.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                bookingDetails.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {bookingDetails.status}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
            <span className="text-2xl">🚖</span>
          </div>
          <p className="text-gray-400 text-sm">No booking details yet</p>
          <p className="text-gray-500 text-xs mt-1">Start a call to book your taxi</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;