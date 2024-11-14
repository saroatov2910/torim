import { Appointment, Maybe, User } from "../@types";


// Function to check if the user is a doctor
export function isDoctor(user: Maybe<User>): boolean {
  // Returns true if the user's role is "doctor"
  return user?.role === "doctor";
}

// Function to check if the user is a patient
export function isPatient(user: Maybe<User>): boolean {
  // Returns true if the user's role is "patient"
  return user?.role === "patient";
}

// Function to check if the appointment is after the current time
export function isAfterNow(appointment: Appointment) {
  const date = new Date(appointment.date);// Converts the appointment date to a Date object
  console.log("Appointment Date:", date); // Log the appointment date
  console.log("Now:", new Date());// Log the current date

// Split the time into hours and minutes from appointment.time
  const [h, m] = appointment.time.split(":");
  date.setHours(parseInt(h));// Set the hours on the date object
  date.setMinutes(parseInt(m)); // Set the minutes on the date object

  return date.getTime() >= new Date().getTime();// Returns true if the appointment date is in the future
}