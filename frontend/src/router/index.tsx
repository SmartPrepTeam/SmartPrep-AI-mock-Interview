// import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import SignupForm from '@/components/forms/SignupForm';
import Home from '@/components/Home';
import LandingPage from '@/components/LandingPage';
import LoginForm from '@/components/forms/LoginForm';

import ResumeUpload from '@/components/ResumeUpload';
import UserProfileForm from '@/components/UserProfileForm';
import NotFoundPage from '@/components/NotFoundPage';
import TextQuestionContainer from '@/components/TextQuestionContainer';
import TextScoreContainer from '@/components/TextScoreContainer';
import InterviewSetupContainer from '@/components/InterviewSetupContainer';
import { ReactElement, useContext } from 'react';
import AuthContext from '@/context/auth_context';
const PrivateRoute = () => {
  const auth = useContext(AuthContext);
  if (!auth?.token) {
    <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
const PublicRoute = ({ children }: { children: ReactElement }) => {
  const auth = useContext(AuthContext);
  if (auth?.token) {
    <Navigate to="home" replace />;
  }
  return children;
};
const Router = () => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupForm />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        ></Route>
        <Route element={<PrivateRoute />}>
          <Route path="home" element={<Home />}></Route>
          <Route path="resume" element={<ResumeUpload />}></Route>
          <Route path="add-profile" element={<UserProfileForm />}></Route>
          <Route
            path="textual-interview"
            element={<TextQuestionContainer />}
          ></Route>
          <Route
            path="textual-interview/setup"
            element={<InterviewSetupContainer />}
          ></Route>
          <Route
            path="textual-interview/results"
            element={<TextScoreContainer />}
          ></Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default Router;
