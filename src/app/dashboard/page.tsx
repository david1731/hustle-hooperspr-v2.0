
import React from "react";
import GetSession  from '../../components/GetSession';
 import { User } from '@/app/lib/definitions';

export default async function Page(){
    return (
        <div>
            <GetSession>
                {(user: User) => (
                    <div>
                    <h2>Dashboard</h2>
                    <p>Welcome to your dashboard, {user.name}</p>
                    {/* Add your dashboard content here */}
                  </div>
                )}
            </GetSession>
        </div>
    );
};