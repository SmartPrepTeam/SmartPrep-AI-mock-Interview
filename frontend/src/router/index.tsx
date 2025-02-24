// import React from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import SignupForm from '@/components/forms/SignupForm';
import Home from '@/components/Home';
import LandingPage from '@/components/LandingPage';
import LoginForm from '@/components/forms/LoginForm';
import HistoryInsights from '@/components/History/HistoryInsights'
import ResumeUpload from '@/components/ResumeUpload';
import UserProfileForm from '@/components/UserProfileForm';
import NotFoundPage from '@/components/NotFoundPage';
import TextQuestionContainer from '@/components/TextQuestionContainer';
import TextScoreContainer from '@/components/TextScoreContainer';
import InterviewSetupContainer from '@/components/InterviewSetupContainer';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
const PrivateRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
const PublicRoute = ({ children }: { children: ReactElement }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (token) {
    console.log('navigating to home ');
    return <Navigate to="/home" replace />;
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
          <Route path="/home" element={<Home />}></Route>
          <Route path="/resume" element={<ResumeUpload />}></Route>
          <Route path="/add-profile" element={<UserProfileForm />}></Route>
          <Route
            path="/textual-interview"
            element={<TextQuestionContainer />}
          ></Route>
          <Route
            path="/textual-interview/setup"
            element={<InterviewSetupContainer />}
          ></Route>
          <Route
            path="/textual-interview/results"
            element={<TextScoreContainer />}
          ></Route>
          <Route path="history-insights" element={<HistoryInsights />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        
      </Routes>
    </>
  );
};

export default Router;
