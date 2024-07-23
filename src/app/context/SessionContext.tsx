
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@/app/lib/definitions';

interface SessionProviderProps {
  user: User;
  children: ReactNode;
}

const SessionContext = createContext<User | null>(null);

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ user, children }: SessionProviderProps) => {
  return (
    <SessionContext.Provider value={user}>
      {children}
    </SessionContext.Provider>
  );
};

