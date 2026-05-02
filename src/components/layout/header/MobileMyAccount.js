import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";

const MobileMyAccount = () => {
  const { isLoggedIn, user } = useAuth();

  const dashboardLink =
    user?.role === "TUTOR"
      ? "/instructor-profile"
      : "/parent-profile";

  return (
    <div className="mt-9 mb-6 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <ul className="space-y-2">
        <li>
          {isLoggedIn ? (
            <>
              <Link
                href={dashboardLink}
                className="block text-darkdeep1 text-sm font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
              >
                My Account
              </Link>
              {user?.role === "TUTOR" && (
                <Link
                  href="/wallet"
                  className="block text-darkdeep1 text-sm font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor mt-2"
                >
                  Wallet (${user?.walletBalance?.toFixed(2) || '0.00'})
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="block text-darkdeep1 text-sm font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default MobileMyAccount;
