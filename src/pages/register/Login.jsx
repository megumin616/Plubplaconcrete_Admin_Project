import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/menageproduct";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              value={password}
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
            <div>
              <p style={{marginTop: "1rem", fontWeight: "500"}}>
                Already registered <Link to="/register"><span style={{color: "skyblue"}}>Login</span></Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
