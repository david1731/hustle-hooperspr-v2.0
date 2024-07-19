export type User = {
  name: string;
  email: string;
  image: string;
};


export type Client = {
    client_id: number;
    fullname: string;
    email: string;
  };
  
  export type Trainer = {
    trainer_id: number;
    name: string;
    lastname: string;
    email: string;
  };
  
  export type Service = {
    service_id: number;
    servicename: string;
    description: string;
  };
  
  export type TimeSlot = {
    slot_id: number;
    starttime: string;
    endtime: string;
    status: string;
  };
  
  export type Level = {
    level_id: number;
    level: string;
    description: string;
  };
  
  export type TrainerTimeSlot = {
    trainer_id: number;
    slot_id: number;
  };
  
  export type AppointmentSlot = {
    app_id: number;
    slot_id: number;
    client_id: number;
    level_id: number;
    trainer_id: number;
    service_id: number;
    date: string;
  };
  export type AppointmentQueryResult = {
    app_id: number;
    date: string;
    starttime: string;
    endtime: string;
    client_name: string;
    trainer_name: string;
    trainer_lastname: string;
    servicename: string;
    level: string;
  };
    

