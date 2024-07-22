import React, { ReactNode } from 'react';
import { User } from '@/app/lib/definitions';
import {authOptions} from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

export default async function GetSession({ 
  children, 
}: Readonly<{
  children: (user: User) => ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session){
    return (
      <div>
        <p>Your are not signed in</p>
      </div>
    );
  }

  const user : User = {
    name: session.user?.name || '',
    email: session.user?.email || '',
    image: session.user?.image || '',
  };
  return (
    <div>
      {children(user)}
    </div>
  );
}
