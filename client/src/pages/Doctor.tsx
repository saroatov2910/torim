import AuthGuarded from "../components/AuthGuarded";
import { useDoctor } from "../../store/user.slice";
import { useMemo } from "react";
import AppointmentList, { Side } from "../components/AppointmentList";
import { isAfterNow } from "../utils";
import ChatList from "../components/ChatList";

function Doctor() {
  const doctor = useDoctor();

  const upcommingAppointments = useMemo(
    () => (doctor.doc_appointments ?? []).filter(isAfterNow),
    [doctor]
  );
  const previousAppointments = useMemo(
    () => (doctor.doc_appointments ?? []).filter((a) => !isAfterNow(a)),
    [doctor]
  );
  return (
    <div>
      <h2 className="font-bold text-[20px]">
        {doctor.email} - {doctor.profession} doctor
      </h2>
      <p>Appointments and patient history</p>

      <h2 className="font-bold py-2">Upcomming Appointments</h2>
      <AppointmentList side={Side.Doctor} appointments={upcommingAppointments} />
      <h2 className="font-bold py-2">Previous appointments</h2>
      <AppointmentList side={Side.Doctor} appointments={previousAppointments} />

      <ChatList/>
    </div>
  );
}

export default AuthGuarded(Doctor, "doctor");


