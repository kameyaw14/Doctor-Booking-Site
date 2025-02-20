import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../contexts/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../contexts/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendURL } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const OnSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);

    try {
      if (state === "Admin") {
        //calling adminLogin api
        const { data } = await axios.post(backendURL + "/api/admin/login", {
          adminEmail: email,
          adminPassword: password,
        });

        if (data.success) {
          //getting and storing token
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Logged in successfully");
        } else {
          toast.error(data.message);
        }
        // calling adminLogin api
      } else {
        //calling doctor login api
        console.log("doctor");

        const { data } = await axios.post(backendURL + "/api/doctors/login", {
          docEmail: email,
          docPassword: password,
        });

        if (data.success) {
          //getting and storing token
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Logged in successfully");
          console.log("success" + data.token);
        } else {
          toast.error(data.message);
        }
      }
      // if (state === "Doctor") {
      // }
    } catch (error) {}
  };

  return (
    <div>
      <form
        onSubmit={OnSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">{state}</span>
            Login
          </p>

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="text"
              required
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
            />
          </div>

          <button className="bg-primary text-white w-full py-2 rounded-md text-base">
            Login
          </button>
          {state === "Admin" ? (
            <p>
              Doctor Login?{" "}
              <span
                onClick={() => {
                  setState("Doctor");
                }}
                className="text-primary underline cursor-pointer"
              >
                Click here
              </span>{" "}
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                onClick={() => {
                  setState("Admin");
                }}
                className="text-primary underline cursor-pointer"
              >
                Click here
              </span>{" "}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
