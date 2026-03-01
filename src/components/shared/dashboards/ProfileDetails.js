"use client"; // This line makes the component a Client Component
import { useGetUserQuery } from "@/redux/services/userSlice";
// import { useGetUserQuery } from "@/redux/services/userSlice";
import moment from "moment/moment";
import React from "react";

const ProfileDetails = () => {
  const userLogged = localStorage.getItem("user");
  const parsedUser = JSON.parse(userLogged);
  const { userId } = parsedUser;
  console.log(userId, "userId");

  const { data: user, error, isLoading } = useGetUserQuery(userId);

  console.log(user, "data");

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Profile
        </h2>
      </div>

      <div>
        <ul>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Registration Date</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
                {moment(user?.createdAt).format("DD, MMMM yyyy H:MM A")}
              </span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">First Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.firstName}</span>
            </div>
          </li>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Last Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.lastName}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Username</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
                {" "}
                {user?.firstName + " " + user?.lastName}
              </span>
            </div>
          </li>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">User Type</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block"> {user?.userType}</span>
            </div>
          </li>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Email</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block"> {user?.email}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Phone Number</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.phone}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Subject</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
                {user?.parentStudentProfile?.subject}
              </span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Info</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
                {user?.firstName} is a living in{" "}
                {user?.parentStudentProfile?.emirates}, follows{" "}
                {user?.parentStudentProfile?.curriculum} Curriculam and Subject
                needed is {user?.parentStudentProfile?.subject}.
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
