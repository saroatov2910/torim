import axios from "axios";
import { Appointment, AppointmentForm, Chat, Doctor, LoginForm, RegisterForm, User } from "../@types";

async function putRequest<T, U>(path: string, form: T) {
  try {
    const response = await axios.put<U | string>(path, form);
    if (response.status % 200 < 100) {
      return response.data as U;
    }
    throw new Error(response.data as string);
  } catch (e: any) {
    throw new Error(e.response.data as string);
  }
}

async function postRequest<T, U>(path: string, form: T) {
  try {
    const response = await axios.post<U | string>(path, form);
    if (response.status % 200 < 100) {
      return response.data as U;
    }
    throw new Error(response.data as string);
  } catch (e: any) {
    if(e.response.data.detail) {
      let message = ""
      for (let d of e.response.data.detail) {
        const [_,loc] = d.loc
        if(!loc) continue
        const msg = loc + " -"  + d.msg
        message += msg + ', '
      }
      throw new Error(message)
    }
    throw new Error(e.response.data as string);
  }
}

async function getRequest<U>(path: string) {
  try {
    const response = await axios.get<U | string>(path);
    if (response.status % 200 < 100) {
      return response.data as U;
    }
    throw new Error(response.data as string);
  } catch (e: any) {
    throw new Error(e.response.data as string);
  }
}

export async function login(form: LoginForm) {
  return postRequest<LoginForm, { access_token: string }>("/auth/login", form);
}

export async function getAllChats() {
  return getRequest<{ chats: Chat[] }>("/chat/allchats");
}
export async function registerPatient(form: RegisterForm) {
  return postRequest<RegisterForm, { id: number }>("/auth/register_patient", form);
}
export async function registerDoctor(form: RegisterForm) {
  return postRequest<RegisterForm, { id: number }>("/auth/register_doctor", form);
}

export async function me() {
  return getRequest<User>("/auth/me");
}

export async function scheduleAppointment(form: AppointmentForm) {
  return postRequest<AppointmentForm, Appointment>("/appointments/schedule", form);
}

export async function editDoctor(profession: string) {
  return putRequest<{ profession: string }, User>("/auth/edit-doctor", { profession });
}

export async function getDoctors() {
  return getRequest<Doctor[]>("/doctors");
}
