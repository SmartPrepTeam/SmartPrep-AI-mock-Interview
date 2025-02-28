import  { useState } from "react";
import {  useSelector } from 'react-redux';  // Import Redux hooks
import axios from 'axios';
import { RootState } from '@/redux/store';

const AccountSettings = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  
  const token = useSelector((state:RootState) => state.auth.token); // Get the token from Redux store
  // Update email API call
  const handleEmailUpdate = async () => {
    if (!newEmail) {
      setErrorMessage("New email cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/change-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setCurrentEmail(newEmail);
        setNewEmail("");
        setIsEditingEmail(false);
        alert("Email updated successfully!");
      } else {
        setErrorMessage(data?.message || "Failed to update email.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating email.");
    } finally {
      setIsLoading(false);
    }
  
  };

  // Change password API call
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    if (!newPassword || !currentPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put("http://localhost:8000/api/auth/change-password",{ current_password: currentPassword, new_password: newPassword },{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    
      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert("Password updated successfully!");
      } else {
        setErrorMessage(response.data?.message || "Failed to update password.");
      }
    } catch (error: any) {
      // Enhanced error handling with axios
      if (error.response) {
        setErrorMessage(error.response.data?.message || "Failed to update password.");
      } else {
        setErrorMessage("An error occurred while updating password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-sans text-lg text-white lg:text-3xl font-bold p-6">
        Account Settings
      </h2>

      <div className="flex flex-col items-center bg:none md:bg-[#10132E] border border-gray-400 p-6 lg:p-12 shadow-lg max-w-3xl mx-auto mt-6 mb-6">
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <div className="mb-8 w-full">
          <p className="font-medium text-white mb-2 font-sans">Email Address</p>
          <p className="text-gray-300">{currentEmail}</p>
          {!isEditingEmail ? (
            <button
              onClick={() => setIsEditingEmail(true)}
              className="mt-2 text-sm text-blue-500 hover:underline font-sans"
            >
              Update Email
            </button>
          ) : (
            <div className="mt-4 space-y-4">
              <input
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-gray-800 rounded-full py-2 px-4 text-white bg-black focus:outline-none"
              />
              <button
                onClick={handleEmailUpdate}
                className="text-sm font-medium border border-purple-500 text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-full font-sans"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="w-full">
          <p className="font-medium text-white mb-2 font-sans">Change Password</p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-800 rounded-full py-2 px-4 bg-black text-white focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-800 rounded-full py-2 px-4 bg-black text-white focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-800 rounded-full py-2 px-4 bg-black text-white focus:outline-none"
            />
            <button
              onClick={handlePasswordChange}
              className="text-sm font-medium border border-purple-500 text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-full font-sans"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
