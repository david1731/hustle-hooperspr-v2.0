import React from "react";
import GetSession from '@/components/GetSession';
import AppointmentsList from '@/components/AppointmentsList';
import { User } from '@/app/lib/definitions';

export default async function Page(){
    return (
        <div>
            <GetSession>
                {(user: User) => (
                    <div>
                    <h2>Dashboard</h2>
                    <AppointmentsList email={user.email}/>
                  </div>
                )}
            </GetSession>
        </div>
    );
};