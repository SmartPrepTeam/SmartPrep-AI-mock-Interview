// import React from 'react'
import { Routes, Route } from 'react-router-dom';
import SignupForm from '@/components/forms/SignupForm';
import LoginForm from '@/components/forms/LoginForm';
const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/signup" element={<SignupForm />}></Route>
      </Routes>
    </>
  );
};

export default Router;
