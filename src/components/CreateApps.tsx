import React from "react";
import { fetchTrainers } from '@/app/lib/data';
import { Trainer } from '@/app/lib/definitions';

export default async function CreateApp(){
    let trainers: Trainer[] = [];
    try{
        trainers = await fetchTrainers();
    } catch(error){
        console.log("Error fetching trainers", error);
    }
    console.log("Trainers:", trainers);

    return (
        <div className="dropdown">
          <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Trainers
          </a>
          <ul className="dropdown-menu">
            {trainers.length === 0 ? (
              <li><a className="dropdown-item" href="#">No trainers available</a></li>
            ) : (
              trainers.map((trainer) => (
                <li key={trainer.trainer_id}>
                  <a className="dropdown-item" href="#">{trainer.name} {trainer.lastname}</a>
                </li>
              ))
            )}
          </ul>
        </div>
    );
}