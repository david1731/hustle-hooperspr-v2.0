// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useSession } from '@/app/context/SessionContext';
import "../../styles/style.css";
export default function DashboardPage() {
  const user = useSession();

  if (!user) {
    return (
      <div className='container'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='container'>
      <h2>Portal de Cliente</h2>
      <p>Bienvenidos a tu portal personalizado, {user.name}</p>
      {/* Add your dashboard content here */}
    </div>
  );
};




