import React from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

const WalletButton = () => {
  const { user } = useUser();
  const walletBalance = user?.walletBalance || 0;

  return (
    <Link
      href="/wallet"
      className="flex items-center gap-2 px-4 py-2 text-blackColor hover:text-whiteColor bg-whiteColor hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor"
    >
      <i className="icofont-wallet"></i>
      <span>${walletBalance.toFixed(2)}</span>
    </Link>
  );
};

export default WalletButton; 