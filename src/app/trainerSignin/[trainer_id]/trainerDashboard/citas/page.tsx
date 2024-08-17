import React from "react";
import AppointmentsList from "@/components/TrainerAppList";

interface PageProps {
    params: {
      trainer_id: string;
    };
}
  
export default function Page({ params }: PageProps){
    const trainer_id = Number(params.trainer_id);
    if (isNaN(trainer_id)) {
        return <p>Invalid Trainer ID</p>;
    }
    return(
       <>
         <h1>Trainer Citas</h1>
         <AppointmentsList trainer_id={trainer_id}/>
       </>
    )
}