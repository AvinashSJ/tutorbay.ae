"use client";
import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userLogged = localStorage.getItem('user');
      if (userLogged) {
        const parsedUser = JSON.parse(userLogged);
        setUser(parsedUser);
        setUserId(parsedUser?.userId);
      }
    }
  }, []);

  return { user, userId };
}; 