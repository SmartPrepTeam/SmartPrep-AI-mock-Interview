// import React from 'react'
import { Routes, Route } from 'react-router-dom';
import SignupForm from '@/components/forms/SignupForm';
import Home from '@/components/Home';
import LandingPage from '@/components/LandingPage';
import LoginForm from '@/components/forms/LoginForm';
import ResumeUpload from '@/components/ResumeUpload';
import UserProfileForm from '@/components/UserProfileForm';
import UserProfile from '@/components/UserProfile';
import { Dashboard } from '@/components/Dashboard';
const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/signup" element={<SignupForm />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/resume" element={<ResumeUpload />}></Route>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/add-profile" element={<UserProfileForm />}></Route>
        <Route path="/home/user-profile" element={<UserProfile />}></Route>
        <Route path="/interviews" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
};

export default Router;
