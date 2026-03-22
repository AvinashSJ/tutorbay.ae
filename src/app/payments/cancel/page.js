"use client";
import Link from 'next/link';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-yellow-500 text-6xl mb-4">
          <i className="icofont-warning"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-x-4">
          <Link
            href="/dashboards/wallet"
            className="inline-block px-6 py-3 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
          >
            Try Again
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

export default PaymentCancel; 