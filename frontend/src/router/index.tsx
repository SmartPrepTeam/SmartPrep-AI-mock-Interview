// import React from 'react'
import { Routes, Route } from 'react-router-dom';
import SignupForm from '@/components/forms/SignupForm';
import Home from '@/components/Home';
import LoginForm from '@/components/forms/LoginForm';
const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/signup" element={<SignupForm />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
};

export default Router;
