import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Reguster() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        console.log(user)
        if (user) {
            await setDoc(doc(db, "UserAdmin", user.uid), {
                email: user.email,
                firstName: fname,
                lastName: lname,
            });
        }
        console.log("User Resistered Successfully!")
        // toast.success("User Registered Successfully!!" , {
        //     position: "top-center"
        // });
        navigate("/login");
    } catch (error) {
        console.log(error)
        // toast.success(error.message, {
        //     position: "bottom-center"
        // })
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                for="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div>
              <label
                for="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label for="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label
              for="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
