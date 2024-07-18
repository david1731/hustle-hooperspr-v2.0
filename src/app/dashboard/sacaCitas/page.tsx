'use client';
import React from "react";
import GetSession  from '../../../components/GetSession';
import AppointmentsList from '@/components/AppointmentsList';
export default function Page(){
    return (
        <div>
            <GetSession>
                {(user) => <AppointmentsList email={user.email} />}
            </GetSession>
        </div>
    );
};