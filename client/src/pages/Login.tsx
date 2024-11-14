import { useSelector } from "react-redux";
import { LoginForm } from "../../@types";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { actions, loginUser } from "../../store/user.slice";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import AuthError from "../components/AuthError";
import LoggedInGuarded from "../components/LoggedInGuarded";
import { toast } from "react-toastify";
import { useEffect } from "react";

  // Component for user login
function Login() {
   // Select the loading state from the Redux store
  const loginLoading = useSelector<RootState, boolean>((state) => state.user.loading);
  const dispatch = useDispatch<AppDispatch>();
      // Clear any existing errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(actions.clearError());
    };
  }, []);


// dunc submitLogin
  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    ) as any as LoginForm;
    dispatch(loginUser(form)).then((d) => {
      if(d.payload)
        toast.success("Welcome back");
    });
  }
  return (
    <div>
      <form
        onSubmit={submitLogin}
        className="p-8 border-[1px] border-[lightgray] rounded-md mx-auto max-w-[400px] gap-2 my-4"
      >
        <h2 className="text-[20px] text-center font-bold">Login</h2>

        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2" htmlFor="email">
            Email
          </label>
          <input
            name="email"
            placeholder="Enter email address"
            type="email"
            id="email"
            className="outline-none border-[1px] border-[lightgray] p-2 rounded-md w-full"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label className="font-bold pt-2" htmlFor="password">
            Password
          </label>
          <input
            name="password"
            placeholder="Enter password"
            type="password"
            id="password"
            className="outline-none border-[1px] border-[lightgray]  p-2 rounded-md w-full"
          />
        </div>
        <button className="w-full mt-4 text-white" type="submit">
          Login
        </button>
        <div className="py-2 text-center">
          Don't have an account? <Link to="/register">Create one now</Link>
        </div>
      </form>

      <Spinner loading={loginLoading} />

      <AuthError />
    </div>
  );
}

export default LoggedInGuarded(Login);
