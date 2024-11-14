import { FunctionComponent } from "react";
import { Maybe, User } from "../../@types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Navigate } from "react-router";

export default function LoggedInGuarded<TProps extends JSX.IntrinsicAttributes>(
  Component: FunctionComponent<TProps>
) {
  return function useRedirection(props: TProps) {
    const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);

    if (!user) {
      return <Component {...props} />;
    }
    if (user.role === "doctor") {
      return <Navigate to="/doctor" />;
    }

    return <Navigate to="/patient" />;
  };
}
