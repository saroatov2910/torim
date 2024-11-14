import { FunctionComponent } from "react";
import { Maybe, Role, User } from "../../@types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Navigate } from "react-router";

export default function AuthGuarded<TProps extends JSX.IntrinsicAttributes>(
  Component: FunctionComponent<TProps>,
  role?: Role
) {
  return function useRedirection(props: TProps) {
    const user = useSelector<RootState, Maybe<User>>((state) => state.user.user);
    const loading = useSelector<RootState, boolean>((state) => state.user.loading);

    if (!user && !loading) {
      return <Navigate to="/login" />;
    }
    if(loading) {
      return <div>Loading..</div>
    }

    if (role && user?.role !== role) {
      return (
        <div>
          <h1>Unauthorized</h1>
          <p>You do not have permission to access this page</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

