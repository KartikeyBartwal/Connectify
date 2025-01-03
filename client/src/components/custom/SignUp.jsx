import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );

  const nextIndex = () => {
    setIndex((index) => (index + 1) % 2);
  };
  const prevIndex = () => {
    setIndex((index) => (index - 1) % 2);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [infoFormData, setInfoFormData] = useState({
    name: formData.name,
    bio: "",
    profileUrl: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInfoChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "profileUrl" && files.length > 0) {
      const file = files[0];
      setInfoFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setInfoFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful", result);
        localStorage.setItem("token", result.token);
        nextIndex();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Error submitting form: " + error.message);
    }
  };

  const onInfoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("bio", infoFormData.bio);
      if (infoFormData.profileUrl) {
        formData.append("profileUrl", infoFormData.profileUrl);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/updateInfo`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Info updated successfully", result);
        navigate("/"); 
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to update info");
      }
    } catch (error) {
      setErrorMessage("Error submitting form: " + error.message);
    }
  };

  return (
    <>
      <div className="relative inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blueNew/25 rounded-full filter blur-3xl"></div>
        <div className="absolute top-80 right-20 w-72 h-72 bg-pinkNew/25 rounded-full filter blur-3xl"></div>
      </div>

      <div className="bg-gradient-to-b from-gray-950 via-gray-900/50 to-black/60 flex justify-center items-center w-full h-screen text-gray-300">
        {index === 0 && (
          <form
            onSubmit={onSubmit}
            className="p-10 w-120 h-160 bg-gray-950/50 z-50 flex flex-col justify-center items-center gap-7 border-2 border-l-pinkNew border-b-blueNew border-t-pinkNew  border-r-blueNew"
          >
            {errorMessage && (
              <p className="test-md text-red">{errorMessage} </p>
            )}
            <h2 className=" font-bold text-5xl bg-gradient-to-r from-gray-200 via-pinkNew to-blue bg-clip-text text-transparent animate-gradient">
              SignUp
            </h2>
            <div className="flex flex-col gap-2">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Username"
                value={formData.name}
                onChange={handleChange}
                className="p-3 h-8 border-1 border-t-pinkNew border-l-pinkNew border-b-blueNew border-r-blueNew bg-gray-800/50 focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter email"
                onChange={handleChange}
                className="p-3 h-9 border-1 border-t-pinkNew border-l-pinkNew border-b-blueNew border-r-blueNew bg-gray-800/50 focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="p-3 h-9 border-1 border-t-pinkNew border-l-pinkNew border-b-blueNew border-r-blueNew bg-gray-800/50  focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <button
              className="mt-4 w-64 px-3 bg-gradient-to-r from-[#3B82F6]/70 via-[#F472B6]/80 to-[#3B82F6]/70 text-white py-2 rounded-xl transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-pink/20"
              type="submit"
            >
              Submit
            </button>
            <p className="text-blue">
              Already have an account?{" "}
              <Link className="text-pinkNew no-underline" to={"/login"}>
                Login Here!
              </Link>
            </p>
          </form>
        )}
        {index === 1 && (
          <form
            onSubmit={onInfoSubmit}
            className="p-10 w-120 h-160 bg-gray-950/50 z-50 flex flex-col justify-center items-center gap-7 border-2 border-l-pinkNew border-b-blueNew border-t-pinkNew  border-r-blueNew"
          >
            {errorMessage && (
              <p className="test-md text-red">{errorMessage} </p>
            )}
            <h2 className=" font-bold text-5xl bg-gradient-to-r from-gray-200 via-pinkNew to-blue bg-clip-text text-transparent animate-gradient">
              About You!
            </h2>

            <div className="flex flex-col items-center justify-center gap-2">
              
              <img
                src={previewUrl}
                className="h-28 w-28 rounded-full p-1 border-2 border-gray-400 object-cover "
                alt="Preview"
              />

              <label className="text-pinkNew">Profile Pic</label>
              <input
                type="file"
                name="profileUrl"
                onChange={handleInfoChange}
                placeholder="Upload profile picture"
                className="flex justify-center"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Bio</label>
              <input
                type="text"
                name="bio"
                value={infoFormData.bio}
                placeholder="Tell us something about yourself..."
                onChange={handleInfoChange}
                className="p-3 h-20 border-1 border-t-pinkNew border-l-pinkNew border-b-blueNew border-r-blueNew bg-gray-800/50 focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <button
              className="mt-4 w-64 px-3 bg-gradient-to-r from-[#3B82F6]/70 via-[#F472B6]/80 to-[#3B82F6]/70 text-white py-2 rounded-xl transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-pink/20"
              type="submit"
            >
              Next
            </button>
            <p className="text-blue">
              Already have an account?{" "}
              <Link className="text-pinkNew no-underline" to={"/login"}>
                Login Here!
              </Link>
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default SignUp;
