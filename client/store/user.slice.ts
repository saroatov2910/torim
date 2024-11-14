import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LoginForm,
  RegisterForm,
  PatientRegisterForm,
  DoctorRegisterForm,
  User,
  Maybe,
  Appointment,
  Chat,
} from "../@types";
import * as userService from "../services/netservice";
import { RootState } from ".";
import { useSelector } from "react-redux";

export interface UserStore {
  user: User | null | undefined;
  token: string | null | undefined;
  chats: Chat[]
  loading: boolean;
  error: unknown;
}

const initialState: UserStore = {
  user: undefined,
  chats: [],
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
};

export const loginUser = createAsyncThunk("user/login", async (form: LoginForm) => {
  return userService.login(form);
});

export const getAllChats = createAsyncThunk("user/allchats", async () => {
  return userService.getAllChats();
});

export const editDoctor = createAsyncThunk("user/edit-doctor", async (profession: string) => {
  return userService.editDoctor(profession);
});

export const registerDoctor = createAsyncThunk(
  "user/register_doctor",
  async (form: DoctorRegisterForm) => {
    if (typeof form) {
    }
    return userService.registerDoctor(form);
  }
);
export const registerPatient = createAsyncThunk(
  "user/register_patient",
  async (form: PatientRegisterForm) => {
    if (typeof form) {
    }
    return userService.registerPatient(form);
  }
);

export const me = createAsyncThunk("user/me", async () => {
  return userService.me();
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    addAppointment: (state, action) => {
      const appointment = action.payload as Appointment;
      state.user = {
        ...(state.user as any),
        user_appointments: [...((state.user as any)?.user_appointments ?? []), appointment],
      };
    },
  },
  extraReducers: (builder) => {
        // Get All chats
        builder.addCase(getAllChats.pending, (state) => {

        });
    
        builder.addCase(getAllChats.fulfilled, (state, action) => {
          state.chats = action.payload.chats
        });
    
        builder.addCase(getAllChats.rejected, (state, action) => {
        });
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      localStorage.setItem("token", action.payload.access_token);
      state.token = action.payload.access_token;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      console.log(action.error)

    });
    // Register
    builder.addCase(registerDoctor.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(registerDoctor.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(registerDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    builder.addCase(registerPatient.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(registerPatient.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(registerPatient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
    // Me
    builder.addCase(me.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(me.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(me.rejected, (state, action) => {
      state.loading = false;
    });
    // Edit doctor
    builder.addCase(editDoctor.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(editDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(editDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export function useAuth() {
  const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);
  const loading = useSelector<RootState, boolean>((state) => state.user.loading);

  const token = useSelector<RootState, Maybe<string>>((state) => state.user.token);
  return {user, token}
}

export function useDoctor() {
  const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);
  if (!user) {
    throw new Error("User is not logged in");
  }
  if (user.role !== "doctor") {
    throw new Error("User is not a doctor");
  }
  return user;
}

export function usePatient() {
  const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);
  if (!user) {
    throw new Error("User is not logged in");
  }
  if (user.role !== "patient") {
    throw new Error("User is not a patient");
  }
  return user;
}
export const actions = userSlice.actions;
export const reducer = userSlice.reducer;
