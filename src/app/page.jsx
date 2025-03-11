'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from './dashboard/page';

const HomePage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (!user) {
      router.push('/login'); 
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  // if (!isLoggedIn) {
  //   return null; 
  // }

  return (
    <>
      <Dashboard />
    </>
  );
};

export default HomePage;
