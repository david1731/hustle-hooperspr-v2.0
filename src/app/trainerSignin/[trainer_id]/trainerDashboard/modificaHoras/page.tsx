'use client';

import React from "react";
import { useParams } from "next/navigation";
import TrainerWorkForm from "@/components/TrainerModCitas";
export default function Page(){
    const { trainer_id } = useParams();
    const numericTrainerId = Number(trainer_id);
    return (
        <>
            <TrainerWorkForm trainer_id={numericTrainerId}></TrainerWorkForm>
        </>
        
    )
}