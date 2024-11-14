import React, { useCallback } from "react";
import { Appointment } from "../../@types";
import { Link } from "react-router-dom";

export enum Side {
  Doctor,
  Patient,
}

export default function AppointmentList({
  side,
  appointments,
}: {
  side: Side;
  appointments: Appointment[];
}) {
  const List = useCallback(
    (a: Appointment) => {
      if (side === Side.Patient) {
        return (
          <div>
            <p>
              Appointment with <Link to={`/doctor/${a.doctor_id}`}>{a.doctor?.name}</Link> at {a.date}: {a.time}
            </p>
          </div>
        );
      }

      return (
        <div>
          <p>
            Appointment with {a.user?.name} at {a.date}: {a.time}
          </p>
        </div>
      );
    },
    [side]
  );

  return <div>
  {React.Children.toArray(appointments.map(List))}
 {appointments.length === 0 && <p className="font-bold text-[#bd3333]">No Appointments</p>}
  </div>;
}
