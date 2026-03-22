"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useHandlePaymentWebhookMutation } from '@/redux/services/walletSlice';
import Link from 'next/link';

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [handlePaymentWebhook] = useHandlePaymentWebhookMutation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Invalid session');
      setIsProcessing(false);
      return;
    }

    const processPayment = async () => {
      try {
        const result = await handlePaymentWebhook({ sessionId }).unwrap();
        setTransaction(result?.data);
        setIsProcessing(false);
      } catch (err) {
        setError(err.message || 'Failed to process payment');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, handlePaymentWebhook]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Processing Payment</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">
            <i className="icofont-close-circled"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Failed</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/dashboards/wallet"
            className="inline-block px-6 py-3 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
          >
            Return to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-2xl w-full mx-4">
        <div className="text-green-500 text-6xl mb-4">
          <i className="icofont-check-circled"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Your wallet has been updated successfully.</p>
        
        {/* Transaction Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
              <span className="font-medium text-gray-800 dark:text-white">{transaction?.tranasactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Payment ID:</span>
              <span className="font-medium text-gray-800 dark:text-white">{transaction?.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Amount Added:</span>
              <span className="font-medium text-gray-800 dark:text-white">AED {transaction?.walletCredits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Status:</span>
              <span className="font-medium text-green-600 dark:text-green-400 capitalize">{transaction?.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Date:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {new Date(transaction?.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            href="/dashboards/wallet"
            className="inline-block px-6 py-3 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
          >
            View Wallet
          </Link>
          <Link
            href="/dashboards/instructor-dashboard"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 