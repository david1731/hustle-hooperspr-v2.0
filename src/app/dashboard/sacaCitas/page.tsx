
import React from "react";
import GetSession  from '../../../components/GetSession';
import CreateApp from '@/components/CreateApps';
import { User } from '@/app/lib/definitions';

export default async function Page(){
    return (
        <div>
            <GetSession>
                {(user: User) => (
                    <CreateApp/>
                )}
            </GetSession>
        </div>
    );
};