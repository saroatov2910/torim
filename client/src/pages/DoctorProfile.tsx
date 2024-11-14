import { useParams } from "react-router";
import { useDoctorList } from "../../store/doctors.slice";
import { useMemo } from "react";
import { Link } from "react-router-dom";

//DoctorProfile func :
export default function DoctorProfile() {
  const { doc_id } = useParams();

  const doctors = useDoctorList();
  const doctor = useMemo(
    () => doctors.find((d) => d.id === parseInt(doc_id as string)),
    [doctors, doc_id]
  );

  return (
    <div className="p-2">
      <h2 className="font-bold px-2">{doctor?.name}'s Profile</h2>
      <div style={{
        marginBlock: ".5rem",
        boxShadow: "0 0 5px 0 rgba(0,0,0,0.1)",
        padding: "1rem",
        borderRadius: "5px",
        width: "fit-content",
      }}>
        <p>Proffesion: {doctor?.profession ?? "N/A"}</p>
        <p>Appointments scheduled with this doctor: {doctor?.doc_appointments?.length}</p>
      </div>

      <Link to="/">Back home</Link>
    </div>
  );
}
