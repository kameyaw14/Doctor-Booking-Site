import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken, backendURL } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [userName, setuserName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const navigate = useNavigate();

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        //signup
        const { data } = await axios.post(backendURL + "/api/user/register", {
          userName,
          userEmail,
          userPassword,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(`Welcome ${userName}`);
          setuserEmail("");
          setuserName("");
          setuserPassword("");
        } else {
          toast.error(data.message);
        }
      } else {
        //login
        const { data } = await axios.post(backendURL + "/api/user/login", {
          userEmail,
          userPassword,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(`Logged in succesfully`);
          setuserEmail("");
          setuserPassword("");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <div>
      <form
        onSubmit={handleOnSubmit}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p>
            Please {state === "Sign Up" ? "Create Account" : "Login"} to book
          </p>
          {state === "Sign Up" && (
            <div className="w-full">
              <p>Full Name</p>
              <input
                type="text"
                onChange={(e) => setuserName(e.target.value)}
                value={userName}
                required
                className="border border-zinc-300 rounded w-full pt-2 mt-1"
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              type="email"
              onChange={(e) => setuserEmail(e.target.value)}
              value={userEmail}
              required
              className="border border-zinc-300 rounded w-full pt-2 mt-1"
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              type="password"
              onChange={(e) => setuserPassword(e.target.value)}
              value={userPassword}
              required
              className="border border-zinc-300 rounded w-full pt-2 mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white w-full py-2 mt-1  rounded-md text-base"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("Login");
                }}
                className="text-primary underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create a new account?
              <span
                onClick={() => {
                  setState("Sign Up");
                }}
                className="text-primary underline cursor-pointer"
              >
                {" "}
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
