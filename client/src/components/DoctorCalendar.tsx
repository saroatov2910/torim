import Calendar from "react-calendar";
import { Appointment, Doctor } from "../../@types";
import { useMemo, useState } from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { usePatient } from "../../store/user.slice";
import * as doctorSlice from "../../store/doctors.slice";
import { actions as userActions } from "../../store/user.slice";
import { toast } from "react-toastify";
import { useModal } from "../../context/Modal.context";
import "./DoctorCalendar.css"
export default function DoctorCalendar({ doctor }: { doctor: Doctor }) {
  const [seletedDate, setSelectedDate] = useState<Date | null>(null);
  const patient = usePatient();
  const doctors = doctorSlice.useDoctorList()
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {close} = useModal()
  /*const disabledDates = useMemo(() => {
    const appointments = doctor.doc_appointments ?? [];
    const disabledDates = appointments.map((appointment) => {
      const date = new Date(appointment.date);
      return date;
    });
    return disabledDates;
  }, [doctor]);*/

  const disabledHours = () => {
    const disabled = [] as number[];
    doctor.doc_appointments?.forEach((appointment) => {
      const otherDate = new Date(appointment.date);
      if (seletedDate?.toDateString() === otherDate.toDateString()) {
        const time = appointment.time.split(":");
        disabled.push(parseInt(time[0]));
      }
    });
    return [...disabled, 0, 1, 2, 3, 4, 5, 6, 7]; // Disable all hours before 8 & all hours that are already booked
  };
  const scheduleAppointment = () => {
    const date = seletedDate?.toDateString();
    const time = selectedTime;
    if (!date || !time) {
      return;
    }
    dispatch(
      doctorSlice.scheduleAppointment({ date, time, user_id: patient.id, doctor_id: doctor.id })
    ).then(({ payload }) => {
      const app = payload as Appointment;
      dispatch(userActions.addAppointment(app));
      toast.success("Appointment scheduled successfully");
    });
  };
  return (
    <div>
      <h2 className="font-bold mb-2">Schedule appointment with {doctor.name}</h2>
      <Calendar
        onClickDay={setSelectedDate}
        className={'inner'}
        tileClassName={'inner'}
        /*tileDisabled={({ date, view }) => {
          return (
            view === "month" &&
            disabledDates.some((disabledDate) => {
              return date.toDateString() === disabledDate.toDateString();
            })
          );
        }}*/
        minDate={new Date()}
      />
      {seletedDate && (
        <div className="py-2">
          <h3 className=" pb-[2px] font-bold">Select time</h3>
          <TimePicker
            disabledHours={disabledHours}
            showSecond={false}
            use12Hours={false}
            defaultValue={moment("00:00", "HH:mm")}
            onChange={(time) => {
              setSelectedTime(time ? time.format("HH:mm") : null);
            }}
          />
        </div>
      )}
      {selectedTime && (
        <div className="flex flex-col items-center mt-2">
          <button
          className="confirm"
            onClick={() => {
              scheduleAppointment();
              close();
            }}
          >
            Confirm appointment
          </button>
          <span className="pl-2 text-[12px] text-[gray]">
            Appointment with {doctor.name} on {seletedDate?.toDateString()} at {selectedTime}
          </span>
        </div>
      )}
    </div>
  );
}
