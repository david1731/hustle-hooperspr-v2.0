// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useSession } from '@/app/context/SessionContext';

export default function DashboardPage() {
  const user = useSession();

  if (!user) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard, {user.name}</p>
      {/* Add your dashboard content here */}
    </div>
  );
};




