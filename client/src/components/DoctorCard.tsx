import { useNavigate } from "react-router";
import { Doctor } from "../../@types";
import { useModal } from "../../context/Modal.context";
import DoctorCalendar from "./DoctorCalendar";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { open } = useModal();
  const nav = useNavigate();

  function openDoctorCalendar() {
    open(<DoctorCalendar doctor={doctor} />);
  }

  return (
    <div className="border-[1px] border-[lightgray] max-w-[400px] rounded-md p-2 flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h3 className="font-bold">{doctor.name}</h3>
        <p className="text-[14px] text-[gray]">
          Profession: <strong>{doctor.profession ?? "N/A"}</strong>
        </p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={openDoctorCalendar}
          className="bg-[#5a5acc] text-[white] px-2 py-0 hover:bg-[#4646ad] transition-colors active:bg-[#32329a]"
        >
          Schedule
        </button>
        <button
          onClick={() => nav(`/doctor/${doctor.id}`)}
          className="bg-[#5a5acc] text-[white] px-2 py-0 hover:bg-[#4646ad] transition-colors active:bg-[#32329a]"
        >
          Profile
        </button>
        <button
          onClick={() => nav(`/chat/${doctor.id}`)}
          className="bg-[#5a5acc] text-[white] px-2 py-0 hover:bg-[#4646ad] transition-colors active:bg-[#32329a]"
        >
          Chat
        </button>
      </div>
    </div>
  );
}
