'use client';
// TrainerDropdown.tsx
import React from "react";
import { Trainer } from '@/app/lib/definitions';

interface TrainerDropdownProps {
  trainers: Trainer[];
}

const TrainerDropdown: React.FC<TrainerDropdownProps> = ({ trainers }) => {
  const handleTrainerClick = (trainerId: number) => {
    console.log("Selected Trainer ID:", trainerId);
  };

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
              <a 
                className="dropdown-item" 
                href="#" 
                onClick={() => handleTrainerClick(trainer.trainer_id)}
              >
                {trainer.name} {trainer.lastname}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TrainerDropdown;
