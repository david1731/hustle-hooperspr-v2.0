// CreateApp.tsx
import React from "react";
import { fetchTrainers } from '@/app/lib/data';
import { Trainer } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';

const TrainerDropdown = dynamic(() => import('./TrainerDropdown'), { ssr: false });

export default async function CreateApp(){
    let trainers: Trainer[] = [];
    try{
        trainers = await fetchTrainers();
    } catch(error){
        console.log("Error fetching trainers", error);
    }
    console.log("Trainers:", trainers);

    return (
      <div>
        <TrainerDropdown trainers={trainers} />
      </div>
        
        
    );
}
