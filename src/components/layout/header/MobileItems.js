import React from "react";
import AccordionHome from "./AccordionHome";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileMenuItem from "./MobileItem";
import AccordionPages from "./AccordionPages";
import AccordionCourses from "./AccordionCourses";
import AccordionDashboard from "./AccordionDashboard";
import AccordionEcommerce from "./AccordionEcommerce";
import useAuth from "@/hooks/useAuth";

const MobileMenuItems = () => {
  const { user, isLoggedIn } = useAuth();

  const dynamicItems = isLoggedIn
    ? user?.role === "PARENT"
      ? [{ id: 2, name: "Find Tutor", path: "/find-tutors" }]
      : [{ id: 3, name: "Find Requirements", path: "/find-requirements" }]
    : [{ id: 3, name: "Find Requirements", path: "/find-requirements" }];

  const items = [
    {
      id: 1,
      name: "Home",
      path: "/home",
      // accordion: "accordion",
      // children: <AccordionHome />,
    },
    // {
    //   id: 2,
    //   name: "Pages",
    //   path: "/about",
    //   accordion: "accordion",
    //   children: <AccordionPages />,
    // },
    ...dynamicItems,

    // {
    //   id: 3,
    //   name: "Courses",
    //   path: "/courses",
    //   accordion: "accordion",
    //   children: <AccordionCourses />,
    // },
    // {
    //   id: 4,
    //   name: "Dashboard",
    //   path: "/dashboards/instructor-dashboard",
    //   accordion: "accordion",
    //   children: <AccordionDashboard />,
    // },
    // {
    //   id: 5,
    //   name: "Ecommerce",
    //   path: "/ecommerce/shop",
    //   accordion: "accordion",
    //   children: <AccordionEcommerce />,
    // },
    {
      id: 4,
      name: "Blogs",
      path: "/dashboards/instructor-dashboard",
      // dropdown: <DropdownBlog />,
      // accordion: null,
      // isRelative: true,
    },

    {
      id: 5,
      name: "How it works",
      path: "/about",
      // dropdown: <DropdownPages2 />,
      // isRelative: true,
    },
    {
      id: 6,
      name: "Contact us",
      path: "/contact",
      // dropdown: null,
      // isRelative: false,
    },
  ];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        {items.map((item, idx) => (
          <MobileMenuItem key={idx} item={item} />
        ))}
      </AccordionContainer>
    </div>
  );
};

export default MobileMenuItems;
