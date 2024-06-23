import React, { useState } from "react";
import axios from "axios";
import { backend } from "../../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { ClipLoader } from "react-spinners"; // Import a loader component

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State for managing loader

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/i.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const { firstName, lastName, phoneNumber, ...rest } = formData;
      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        ...rest,
      };
      const response = await axios.post(
        `${backend}/api/users/register`,
        payload
      );
      console.log("Register successful:", response.data);
      toast.success("Registration successful!"); // Success toast notification
      navigate("/login");
    } catch (error) {
      console.error(
        "Error registering:",
        error.response?.data || error.message
      );
      toast.error("Registration failed. Please try again."); // Error toast notification
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center  justify-center  font-satoshi  bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-ind text-center ">
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-ind text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-ind text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border  text-black rounded  focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-ind text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded  text-black focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-ind text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded  text-black focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={toggleShowPassword}
              className="absolute right-3 top-9 cursor-pointer text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center flex-col justify-between mb-4">
            {isLoading ? (
              <div className="flex justify-center w-full">
                <ClipLoader size={35} color={"#4A90E2"} loading={isLoading} />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-ind hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Register
              </button>
            )}
            <div
              onClick={() => navigate("/login")}
              className="text-sm text-ind cursor-pointer hover:underline"
            >
              Already have an account? Login
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />{" "}
      {/* Toast container */}
    </div>
  );
}

export default Register;
