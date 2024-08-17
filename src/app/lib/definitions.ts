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
    fullname: string;
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
    client_name: string;
    trainer_fullname: string;
    starttime: string;
    endtime: string;
    level: string;
    service: string;
    appointment_date: string;
  };
  
  export type TrainerSlots = {
    slot_id : number;
    start_time : string;
    endtime : string;
    date : string;
    status: string;
  }

export type updateTimeSlot = {
  slot_id: number;
  trainer_id: number;
  date: string;
  new_status: string;
}

export type InfoFromAppointments ={
  trainer_id: number;
  slot_id: number;
  date: string;
}
