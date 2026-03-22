"use client";
import React, { useState } from 'react';
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import { useUser } from '@/hooks/useUser';
import PaymentModal from '@/components/shared/wallet/PaymentModal';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '@/redux/services/walletSlice';

const WalletMain = () => {
  const { user } = useUser();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const { data: walletBalance, isLoading: isBalanceLoading } = useGetWalletBalanceQuery(user?._id, {
    skip: !user?._id,
  });
  
  const { data: transactions, isLoading: isTransactionsLoading } = useGetTransactionsQuery(user?._id, {
    skip: !user?._id,
  });
  console.log(transactions, transactions);
  const handlePaymentSuccess = () => {
    // The cache will be automatically invalidated due to the invalidatesTags in the createPayment mutation
  };

  return (
    <>
      <HeroPrimary path={"Wallet"} title={"My Wallet"} />
      
      <div className="container py-6">
        {/* Wallet Balance Card */}
        <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-2">Current Balance</h2>
          {isBalanceLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          ) : (
            <p className="text-3xl font-bold text-primaryColor">AED {walletBalance?.balance?.toFixed(2) || '0.00'}</p>
          )}
          <button 
            className="mt-4 px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            Add Money
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-4">Transaction History</h2>
          {isTransactionsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto"></div>
            </div>
          ) : !transactions?.data?.length ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-borderColor dark:border-borderColor-dark">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Transaction ID</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.data?.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-borderColor dark:border-borderColor-dark">
                      <td className="py-3 px-4">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {transaction.tranasactionId}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.transactionType === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-medium ${
                        transaction.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transactionType === 'credit' ? '+' : '-'}AED {transaction.walletCredits.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.paymentStatus === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default WalletMain; 