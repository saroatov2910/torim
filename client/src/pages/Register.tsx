import { useSelector } from "react-redux";
import { DoctorRegisterForm, PatientRegisterForm, RegisterForm } from "../../@types";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import AuthError from "../components/AuthError";
import LoggedInGuarded from "../components/LoggedInGuarded";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { actions, registerDoctor, registerPatient } from "../../store/user.slice";

function Register() {
  const registerLoading = useSelector<RootState, boolean>((state) => state.user.loading);
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();
  const [isDoctor, setIsDoctor] = React.useState(true);

  useEffect(() => {
    return () => {
      dispatch(actions.clearError());
    };
  }, []);
  function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = Object.fromEntries(new FormData(event.currentTarget).entries()) as any;

    if (isDoctor) {
      dispatch(registerDoctor(form as DoctorRegisterForm)).then((r) => {
        if (r.payload) {
          toast.success("Account created successfully");
          setTimeout(() => {
            nav("/login");
          }, 1000);
        }
      });
    } else {
      dispatch(registerPatient(form as PatientRegisterForm)).then(() => {
        toast.success("Account created successfully");
        setTimeout(() => {
          nav("/login");
        }, 1000);
      });
    }
  }
  return (
    <div>
      <form
        onSubmit={submitRegister}
        className="p-8 border-[1px] border-[lightgray] rounded-md mx-auto max-w-[400px] gap-2 my-4"
      >
        <h2 className="text-[20px] text-center font-bold">Register</h2>

        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2" htmlFor="name">
            Name
          </label>
          <input
            placeholder="Enter full name"
            type="text"
            name="name"
            id="name"
            className="outline-none border-[1px] border-[lightgray] p-2 rounded-md w-full"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2" htmlFor="email">
            Email
          </label>
          <input
            placeholder="Enter email address"
            type="email"
            name="email"
            id="email"
            className="outline-none border-[1px] border-[lightgray] p-2 rounded-md w-full"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2" htmlFor="password">
            Password
          </label>
          <input
            placeholder="Enter password"
            type="password"
            id="password"
            name="password"
            className="outline-none border-[1px] border-[lightgray]  p-2 rounded-md w-full"
          />
        </div>

        {isDoctor && (
          <div className="flex flex-col items-start w-full">
            <label className="font-bold pt-2" htmlFor="profession">
              Profession
            </label>
            <input
              placeholder="Enter profession"
              type="text"
              name="profession"
              id="profession"
              className="outline-none border-[1px] border-[lightgray] p-2 rounded-md w-full"
            />
          </div>
        )}

        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2 pb-[2px]" htmlFor="password">
            Role
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              defaultChecked
              type="radio"
              name="role"
              id="role"
              value={"Doctor"}
              onChange={(e) => {
                if (e.target.checked) {
                  setIsDoctor(true);
                }
              }}
            />
            <label className="font-bold" htmlFor="password">
              Doctor
            </label>
            <input
              type="radio"
              name="role"
              id="role"
              value={"User"}
              onChange={(e) => {
                if (e.target.checked) {
                  setIsDoctor(false);
                }
              }}
            />
            <label className="font-bold" htmlFor="password">
              User
            </label>
          </div>
        </div>
        <button className="w-full mt-4 text-white" type="submit">
          Register
        </button>
        <div className="py-2 text-center">
          Already have an account? <Link to="/login">Sign in now</Link>
        </div>
      </form>

      <Spinner loading={registerLoading} />
      <AuthError />
    </div>
  );
}

export default LoggedInGuarded(Register);
