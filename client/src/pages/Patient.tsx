import { useMemo } from "react";
import { usePatient } from "../../store/user.slice";
import AuthGuarded from "../components/AuthGuarded";
import AppointmentList, { Side } from "../components/AppointmentList";
import { Appointment } from "../../@types";
import { isAfterNow } from "../utils";
import ChatList from "../components/ChatList";



function Patient() {
  const patient = usePatient();

  const upcommingAppointments = useMemo(
    () => (patient.user_appointments ?? []).filter(isAfterNow),
    [patient]
  );
  const previousAppointments = useMemo(
    () => (patient.user_appointments ?? []).filter((a) => !isAfterNow(a)),
    [patient]
  );
  console.log(upcommingAppointments)

  return (
    <div>
      <h2 className="font-bold text-[20px]">Hello {patient.email}</h2>
      <p>Appointments and medical history</p>

      <h2 className="font-bold py-2">Upcomming Appointments</h2>
      <AppointmentList side={Side.Patient} appointments={upcommingAppointments} />
      <h2 className="font-bold py-2">Previous appointments</h2>
      <AppointmentList side={Side.Patient} appointments={previousAppointments} />
      <ChatList/>
    </div>
  );
}

export default AuthGuarded(Patient, "patient");
