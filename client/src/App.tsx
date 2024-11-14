import { useCallback, useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Maybe, User } from "../@types";
import { useDispatch } from "react-redux";
import { actions, getAllChats, me } from "../store/user.slice";
import { Route, Routes, useNavigate } from "react-router";
import Login from "./pages/Login";
import { Link } from "react-router-dom";
import Register from "./pages/Register";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import LoggedInGuarded from "./components/LoggedInGuarded";
import { isDoctor, isPatient } from "./utils";
import EditDoctorProfile from "./pages/EditDoctorProfile";
import DoctorList from "./pages/DoctorList";
import Modal from "./components/Modal";
import DoctorProfile from "./pages/DoctorProfile";
import Chat from "./pages/Chat";


// Home component wrapped with authentication guard
const Home = LoggedInGuarded(() => {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page</p>
      <Link to="/login">Login</Link>
    </div>
  );
});

// Main Application component
function App() {
    // Select token and user from the Redux store
  const token = useSelector<RootState, Maybe<string>>((state) => state.user.token);
  const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();
  useEffect(() => {
    if (token) {
      dispatch(me());
      dispatch(getAllChats())
    }
  }, [token]);

  const AuthenticatedNavbar = useCallback(() => {
    if (!user) return null;
    return (
      <nav className="bg-[whitesmoke] p-2 flex justify-between">
        <span onClick={() => nav("/")} className="font-bold text-[#140707] cursor-pointer">
          Torim
        </span>

        <div className="flex flex-row gap-4 items-center">
          {isDoctor(user) && (
            <span
              onClick={() => {
                nav("/edit-profile");
              }}
              className="font-bold cursor-pointer text-black"
            >
              Edit profile
            </span>
          )}
          {isPatient(user) && (
            <span
              onClick={() => {
                nav("/doctors");
              }}
              className="font-bold cursor-pointer text-black"
            >
              Doctors
            </span>
          )}
          <span
            className="font-bold text-[#bd3333] pr-[2px] cursor-pointer"
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to sign out?");
              if (confirmed) {
                dispatch(actions.signOut());
              }
            }}
          >
            Sign out
          </span>
        </div>
      </nav>
    );
  }, [user]);
  return (
    <div>
      <Modal />
      <AuthenticatedNavbar />
      <div className="p-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-profile" element={<EditDoctorProfile />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/chat/:end_user_id" element={<Chat />} />

          <Route path="/doctor/:doc_id" element={<DoctorProfile />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/doctor" element={<Doctor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
