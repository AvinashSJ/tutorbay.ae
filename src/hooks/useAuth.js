import { useEffect, useState } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    console.log(userData ? JSON.parse(userData) : null, "userData");

    try {
      setUser(userData ? JSON.parse(userData) : null);
    } catch (e) {
      setUser(null);
      console.error("Failed to parse user:", e);
    }
  }, []);

  return { isLoggedIn, user };
};

export default useAuth;
