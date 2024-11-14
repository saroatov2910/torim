import { configureStore } from "@reduxjs/toolkit";
import { reducer as userReducer } from "./user.slice";
import { reducer as doctorsReducer } from "./doctors.slice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    doctors: doctorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
