import { useDispatch } from "react-redux";
import { editDoctor, useDoctor } from "../../store/user.slice";
import AuthGuarded from "../components/AuthGuarded";
import { AppDispatch } from "../../store";
import { FormEvent } from "react";
import { toast } from "react-toastify";

function EditDoctorProfile() {
  const doctor = useDoctor();// Retrieves the current doctor's data

  const dispatch = useDispatch<AppDispatch>();// Initializes the dispatch function

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {// Function to be executed on form submission
    e.preventDefault();// Prevents the default form submission behavior (page refresh)
    const body = Object.fromEntries(new FormData(e.currentTarget).entries()) as any as {// Constructs an object from form data
      profession: string;// Specifies the expected data type
    };
    dispatch(editDoctor(body.profession)).then(() => {
      toast.success("Profession updated successfully");
    });
  };
  return (
    <div>
      <div className="flex flex-col items-start w-full">
        <form onSubmit={onSubmit}> 
          <label className="font-bold pt-2" htmlFor="profession">
            Profession
          </label>
          <input
            placeholder="Enter profession"
            type="text"
            defaultValue={doctor.profession}
            name="profession"
            id="profession"
            className="outline-none border-[1px] border-[lightgray] p-2 rounded-md w-full"
          />
          <button className="w-full mt-4" type="submit">
            Save profession
          </button>
        </form>
      </div>
    </div>
  );
}


export default AuthGuarded(EditDoctorProfile, "doctor");
