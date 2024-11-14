import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppointmentForm, Doctor, User } from "../@types";
import * as doctorsService from "../services/netservice";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from ".";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface DoctorsStore {
  doctors: Doctor[];
  loading: boolean;
  error: unknown;
}
const initialState: DoctorsStore = {
  doctors: [],
  loading: false,
  error: null,
};

const allDoctors = createAsyncThunk("doctors/all", async () => {
  return doctorsService.getDoctors();
});

export const scheduleAppointment = createAsyncThunk(
  "doctors/scheduleAppointment",
  async (form: AppointmentForm) => {
    return doctorsService.scheduleAppointment(form);
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(allDoctors.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allDoctors.fulfilled, (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    });
    builder.addCase(allDoctors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    builder.addCase(scheduleAppointment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(scheduleAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.doctors = state.doctors.map((d) => {
        if (d.id === action.payload.doctor_id) {
          return {
            ...d,
            doc_appointments: [...(d.doc_appointments ?? []), action.payload],
          };
        }
        return d;
      });
    });

    builder.addCase(scheduleAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const useDoctorList = (): Doctor[] => {
  const doctors = useSelector<RootState, Doctor[]>((state) => state.doctors.doctors);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(allDoctors());
    }
  }, []);
  return doctors;
};

export const actions = doctorsSlice.actions;
export const { reducer } = doctorsSlice;
