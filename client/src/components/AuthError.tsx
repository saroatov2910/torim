import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AxiosError } from "axios";

export default function AuthError() {
  const authError = useSelector<RootState, unknown>((state) => state.user.error);
  if (!authError) return null;
  if (typeof authError === "object") {
    if ((authError as any).message) {
      return <div className="bg-red-500 text-white p-4 max-w-[70%] w-fit mx-auto font-bold">{(authError as any).message}</div>;
    }
    return <div className="bg-red-500 text-white p-4 max-w-[70%] w-fit mx-auto font-bold">{JSON.stringify(authError)}</div>;
  }
  return <div className="bg-red-500 text-white p-4 max-w-[70%] w-fit mx-auto font-bold">{authError as string}</div>;
}
