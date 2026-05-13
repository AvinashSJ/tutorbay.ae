"use client";
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import PaymentModal from './PaymentModal';
import { useGetWalletBalanceQuery, useGetTransactionsQuery, useAddFreeCreditsMutation } from '@/redux/services/walletSlice';
import toast from 'react-hot-toast';

const WalletSection = () => {
  const { userId } = useUser();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: walletBalance, isLoading: isBalanceLoading } = useGetWalletBalanceQuery();
  const { data: transactions, isLoading: isTransactionsLoading } = useGetTransactionsQuery(userId, {
    skip: !userId,
  });

  const [addFreeCredits, { isLoading: isAddingFree }] = useAddFreeCreditsMutation();

  const handleAddFreeCredits = async () => {
    try {
      const result = await addFreeCredits({ amount: 100 }).unwrap();
      if (result?.success) {
        toast.success(`Added AED ${result.amount} for testing!`);
      }
    } catch (err) {
      toast.error(err?.data || "Failed to add credits");
    }
  };

  const handlePaymentSuccess = () => {};

  return (
    <>
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            My Wallet
          </h2>
        </div>

        <div className="mb-6 p-6 border border-borderColor dark:border-borderColor-dark rounded-lg">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Balance</p>
          {isBalanceLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          ) : (
            <p className="text-3xl font-bold text-primaryColor">
              AED {walletBalance?.balance?.toFixed(2) || '0.00'}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors text-sm"
            >
              Add Money
            </button>
            <button
              onClick={handleAddFreeCredits}
              disabled={isAddingFree}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isAddingFree ? (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
              ) : (
                <i className="icofont-gift" />
              )}
              Add AED 100 (Test)
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Test mode: Add credits instantly without payment.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Transaction History
          </h3>
          {isTransactionsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto"></div>
            </div>
          ) : !transactions?.length ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-borderColor dark:border-borderColor-dark">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-borderColor dark:border-borderColor-dark">
                      <td className="py-3 px-4 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}AED {tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm">AED {tx.balanceAfter.toFixed(2)}</td>
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

export default WalletSection;
