import Calendar from "react-calendar";
import { useDoctorList } from "../../store/doctors.slice";
import AuthGuarded from "../components/AuthGuarded";
import DoctorCard from "../components/DoctorCard";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { useModal } from "../../context/Modal.context";

function DoctorList() {
  const doctors = useDoctorList();

  return (
    <div>
      <h2 className="font-bold text-[20px]">Doctors</h2>
      {/* <Calendar /> */}
      {/* <TimePicker className="m-4" showSecond={false} use12Hours={false} defaultValue={moment("12:00", "HH:mm")} /> */}
      <div className="flex flex-col gap-2 p-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default AuthGuarded(DoctorList, "patient");
