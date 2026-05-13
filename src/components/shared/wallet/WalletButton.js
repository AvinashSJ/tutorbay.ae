import React from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useGetWalletBalanceQuery } from '@/redux/services/walletSlice';

const WalletButton = () => {
  const { user: authUser } = useAuth();
  const { data: wallet } = useGetWalletBalanceQuery();
  const walletBalance = wallet?.balance ?? 0;
  const isTutor = authUser?.role === "TUTOR";

  return (
    <Link
      href={isTutor ? "/instructor-profile?section=wallet" : "/wallet"}
      className="flex items-center gap-2 px-4 py-2 text-blackColor hover:text-whiteColor bg-whiteColor hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor"
    >
      <i className="icofont-wallet"></i>
      <span>${walletBalance.toFixed(2)}</span>
    </Link>
  );
};

export default WalletButton;
