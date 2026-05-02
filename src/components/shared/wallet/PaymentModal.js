"use client";
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useCreatePaymentMutation } from '@/redux/services/walletSlice';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUser();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const getErrorMessage = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.message;
    if (typeof value?.data === 'string') return value.data;
    if (typeof value?.data?.message === 'string') return value.data.message;
    if (typeof value?.message === 'string') return value.message;
    return 'Payment failed. Please try again.';
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const paymentData = {
        userId: user?.id ?? user?._id,
        email: user.email,
        userType: user?.role,
        amount: parseFloat(amount),
        currency: 'aed', // UAE currency
        customerEmail: user.email
      };

      const response = await createPayment(paymentData).unwrap();
      
      if (response.paymentUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.paymentUrl;
      } else {
        setError('Failed to create payment session');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">Add Money to Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="icofont-close"></i>
          </button>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (AED)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-darkdeep3-dark"
              placeholder="Enter amount"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {getErrorMessage(error)}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal; 