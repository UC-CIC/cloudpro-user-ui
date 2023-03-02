import React from 'react';
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { Questionnaire } from './pages/questionnaire-page';
import { RegisterPage } from './pages/register-page';
import { LoginPage } from './pages/login-page';
import { PtAuthedLanding } from './pages/pt-authed-landing';
import { Registered } from './pages/registered';
import { FormTest } from './pages/form-test';
import { PtLandTest} from './pages/ptland-test'

export const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/registered" element={<Registered />} />
      <Route path="/pt-authed-landing" element={<PtAuthedLanding />} />
      <Route path="/questionnaire" element={<Questionnaire />} />

      <Route path="/formtest" element={<FormTest />} />
      <Route path="/ptlandtest" element={<PtLandTest />} />
    </Routes>
  );
};
