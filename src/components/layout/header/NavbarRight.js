"use client";
import React from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const NavbarRight = () => {
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");

  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const handleLogout = () => {
    // Clear localStorage/token (modify as per your auth)
    localStorage.removeItem("token"); // or sessionStorage, or cookie logic

    // Optional: clear cookies if used
    // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to login or homepage
    router.push("/login"); // or replace with '/'
  };

  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center">
        {/* {!isHome2Dark && (
          <li className="px-5 lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group">
            {/* dropdown menu 
            <DropdownCart />
          </li>
        )} */}
        {isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
          ""
        ) : (
          <li className="hidden lg:block">
            <LoginButton />
          </li>
        )}
        {isLoggedIn && (
          <li className="hidden lg:block">
            <button
              onClick={handleLogout}
              className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
            >
              Logout
            </button>
          </li>
        )}
        {/* <li className="hidden lg:block">
          <Link
            href="/courses"
            className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
          >
            {isHome2Dark
              ? "Get Started Free"
              : isHome4 || isHome4Dark || isHome5 || isHome5Dark
              ? "Get Start Here"
              : "Get Start"}
          </Link>
        </li> */}
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
