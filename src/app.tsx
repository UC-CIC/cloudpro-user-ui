import React from 'react';
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { Questionnaire } from './pages/questionnaire-page';
import { RegisterPage } from './pages/register-page';
import { LoginPage } from './pages/login-page';
import { PtAuthedLanding } from './pages/pt-authed-landing';

export const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/pt-authed-landing" element={<PtAuthedLanding />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
    </Routes>
  );
};
