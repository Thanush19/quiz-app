import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext"; // Adjust the import path as necessary
import { backend } from "../../constant"; // Ensure this points to your backend URL
import { Navigate } from "react-router-dom";

function Login() {
  const { user, login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend}/api/users/login`, {
        email,
        password,
      });
      const token = response.data.token;

      // Store the token in localStorage or any secure place
      localStorage.setItem("authToken", token);

      // Fetch user info
      const userInfoResponse = await axios.get(
        `${backend}/api/users/userinfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = userInfoResponse.data.user;

      // Update context
      login(userData, token);

      console.log("Login successful:", userInfoResponse.data);
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      setLoginError("Invalid email or password"); // Set login error message
    }
  };

  // Redirect based on user role after successful login
  if (user) {
    if (user.role === "seller") {
      return <Navigate to="/seller-home" />;
    } else {
      return <Navigate to="/buyer-home" />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>
        {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
