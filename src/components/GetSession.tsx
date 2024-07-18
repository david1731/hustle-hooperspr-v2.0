'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/app/lib/definitions';

// type GetSessionProps = {
//   children: (user: User) => ReactNode;
// };

export default function GetSession({ 
  children, 
}: Readonly<{
  children: (user: User) => ReactNode;
}>) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ name: '', email: '' });

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      {children(user)}
    </div>
  );
}
