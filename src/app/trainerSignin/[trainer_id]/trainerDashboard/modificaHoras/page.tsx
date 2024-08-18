'use client';

import React from "react";
import { useParams } from "next/navigation";
import TrainerWorkForm from "@/components/TrainerModCitas";
export default function Page(){
    const { trainer_id } = useParams();
    const numericTrainerId = Number(trainer_id);
    return (
        <>
            <h1>Modificar Citas</h1>
            <h2>Trainer ID: {trainer_id}</h2>
            <TrainerWorkForm trainer_id={numericTrainerId}></TrainerWorkForm>
        </>
        
    )
}