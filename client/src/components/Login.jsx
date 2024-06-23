import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { backend } from "../../constant";
import { Link, Navigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ClipLoader } from "react-spinners"; // Import a loader component

function Login() {
  const { user, login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for managing loader

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setLoginError(""); // Clear previous errors
    try {
      const response = await axios.post(`${backend}/api/users/login`, {
        email,
        password,
      });
      const token = response.data.token;

      localStorage.setItem("authToken", token);

      const userInfoResponse = await axios.get(
        `${backend}/api/users/userinfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = userInfoResponse.data.user;

      login(userData, token);

      console.log("Login successful:", userInfoResponse.data);
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      setLoginError("Invalid email or password"); // Set login error message
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Redirect based on user role after successful login
  if (user) {
    return <Navigate to="/" />;
  }

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  font-satoshi  bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-violet-700 text-center">
          Login
        </h2>
        {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-violet-700 text-sm font-bold mb-2">
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
          <div className="mb-4 relative">
            <label className="block text-violet-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10" // Added padding to the right
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4  top-6  flex items-center text-gray-500 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            {isLoading ? (
              <div className="flex justify-center w-full">
                <ClipLoader size={35} color={"#4A90E2"} loading={isLoading} />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-violet-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Login
              </button>
            )}
          </div>
          <Link to="/register" className="mt-6 text-violet-700">
            Don't have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
