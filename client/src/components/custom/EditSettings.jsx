import React, { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../../context/ChatProvider';
import { PopoverBody, PopoverContent } from '../ui/popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@chakra-ui/react';

const EditSettings = ({ onClose }) => {
    
  const { user, setUser } = useContext(ChatContext);

  
  const [userDetails, setUserDetails] = useState({
    name: user?.name,
    bio: user?.bio,
    profilePic: user?.profilePic,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "profilePic" && files.length > 0) {
      const file = files[0];
      setUserDetails((prev) => ({
        ...prev,
        [name]: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
      onClose(); // Close the popover
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("name", userDetails.name);
      formData.append("bio", userDetails.bio);
      if (userDetails.profilePic) {
        formData.append("profileUrl", userDetails.profilePic);
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
        setUser(result.user);
        window.location.reload();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to update info");
      }
    } catch (error) {
      setErrorMessage("Error submitting form: " + error.message);
    }
  };

  return (
    <div>
      <PopoverContent className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl w-96 min-w-2xl animate-scale-in relative z-10 border-1 border-gray-800">
        <PopoverBody>
          <div>
            <div className="p-6 border-b border-gray-800/50 relative">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F472B6] via-[#3B82F6] to-indigo-500 bg-clip-text text-transparent animate-background">
                Edit Settings
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-800/20 relative">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div
                      className="w-24 h-24 rounded-2xl bg-gradient-to-r from-indigo-500 via-pink/50 to-blue p-0.5 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center backdrop-blur-xl cursor-pointer">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCamera}
                            className="text-2xl text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      name="profilePic"
                      ref={fileInputRef}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400"> Name</label>
                    <Input
                      value={userDetails.name}
                      name="name"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter username..."
                      className="w-full bg-gray-800 rounded-md px-3 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Bio</label>
                    <textarea
                      placeholder="Enter bio here!"
                      value={userDetails.bio}
                      onChange={handleChange}
                      name="bio"
                      className="w-full bg-gray-800/80 px-3 py-2 rounded-md text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg mt-2 bg-gradient-to-r from-[#3B82F6]/70 via-[#F472B6]/70 to-[#3B82F6]/70 text-white"
                >
                  Update Info
                </button>
              </div>
            </form>
          </div>
        </PopoverBody>
      </PopoverContent>
    </div>
  );
};

export default EditSettings;
