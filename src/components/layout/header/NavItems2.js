import React from "react";
import DropdownHome from "./DropdownHome";
import DropdownCourses2 from "./DropdownCourses2";
import DropdownBlog from "./DropdownBlog";
import DropdownPages2 from "./DropdownPages2";
import Navitem from "./Navitem";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import useAuth from "@/hooks/useAuth";

const NavItems2 = () => {

const {user, isLoggedIn} = useAuth()
  const navItems = [
    {
      id: 1,
      name: "About",
      path: "/about",
      dropdown: null,
      isRelative: false,
    },
          ...(isLoggedIn && user.userType === "parent"
      ? [
          {
            id: 2,
            name: "Find Tutor",
            path: "/about",
            dropdown: null,
            isRelative: false,
          },
        ]
      :isLoggedIn &&  user.userType === "tutor"
      ? [
          {
            id: 2,
            name: "Find Parents",
            path: "/about",
            dropdown: null,
            isRelative: false,
          },
        ]
      : [
          {
            id: 2,
            name: "Find Parents",
            path: "/about",
            dropdown: null,
            isRelative: false,
          },
        ]),

    {
      id: 3,
      name: "Blog",
      path: "/dashboards/instructor-dashboard",
      // dropdown: <DropdownBlog />,
      dropdown: null,
      isRelative: true,
    },
    {
      id: 4,
      name: "Pricing",
      path: "/about",
      dropdown: null,
      isRelative: false,
    },
    // {
    //   id: 4,
    //   name: "Courses",
    //   path: "/courses",
    //   dropdown: <DropdownCourses2 />,
    //   isRelative: true,
    // },

    // {
    //   id: 5,
    //   name: "Pages",
    //   path: "/about",
    //   dropdown: <DropdownPages2 />,
    //   isRelative: true,
    // },
    {
      id: 5,
      name: "Contact",
      path: "/contact",
      dropdown: null,
      isRelative: false,
    },
  ];
  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-center">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};
export default NavItems2;
