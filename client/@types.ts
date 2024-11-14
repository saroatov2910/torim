export interface LoginForm {
  email: string;
  password: string;
}

export type Role = "doctor" | "patient";
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}
export interface PatientRegisterForm extends RegisterForm {}

export interface DoctorRegisterForm extends RegisterForm {
  profession: string;
}


export interface AppointmentForm {
  date: string;
  time: string;
  user_id: number;
  doctor_id: number;
}
export interface Appointment {
  id: number;
  date: string;
  time: string;
  user_id: number;
  doctor_id: number;
  user: User;
  doctor: User;
}

export type User =
  | {
      id: number;
      name: string;
      email: string;
      role: "patient";
      user_appointments?: Appointment[];
    }
  | {
      id: number;
      name: string;
      email: string;
      role: "doctor";
      profession: string;
      doc_appointments?: Appointment[];
    };

export type Doctor = User & { role: "doctor"; profession: string };    

export type Maybe<T> = T | null | undefined;


export interface Chat {
  id: number;
  doctor_id: number;
  doctor?: User;           // Relationship to the User as Doctor
  patient_id: number;
  patient?: User;         // Relationship to the User as Patient
  messages: Message[];    // One-to-many relationship with Message
}

export interface Message {
  id: number;
  chat_id: number;         // Foreign key to 'Chat'
  sender_id: number;       // Foreign key to 'User' (the sender)
  sender?: User;          // Relationship to the User who sent the message
  content: string;        // Message content
  time: string;           // Time in format HH:MM
  chat?: Chat;            // Relationship back to the Chat
}