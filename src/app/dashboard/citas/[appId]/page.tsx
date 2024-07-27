'use client';
import React from "react";
import { useParams } from "next/navigation";

export default function Page(){
    const { appId } = useParams();
    //fetch appointment info with appID
    return (
        <div>
            <h1>Edit your appointments</h1>
        </div>
    );
};