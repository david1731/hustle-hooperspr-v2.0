'use client';
import React from "react";
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function GetSession(){
    const { data: session, status } = useSession();
    const [user, setUser] = useState({ name: '', email: '', image: '' });
    useEffect(() => {
        if (session) {
          setUser({
            name: session.user?.name || '',
            email: session.user?.email || '',
            image: session.user?.image || '',
          });
        }
      }, [session]);

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}