import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { Questionnaire } from './pages/questionnaire-page';
import { RegisterPage } from './pages/register-page';
import { LoginPage } from './pages/login-page';
import { PtAuthedLanding } from './pages/pt-authed-landing';
import { Registered } from './pages/registered';
import { FormTest } from './pages/form-test';
import { PtLandTest } from './pages/ptland-test';
import { Survey } from './pages/survey-page';
import { Surgeon } from './pages/surgeon-page';
import { SurgeonTester } from './pages/surgeon-page-test';
import { PtReporting } from './pages/pt-reporting-page';


export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/registered" element={<Registered />} />
      <Route path="/pt-authed-landing" element={<PtAuthedLanding />} />
      <Route path="/pt-authed-reporting" element={<PtReporting />} />
      <Route path="/questionnaire/:stateHash" element={<Questionnaire />} />
      <Route path="/survey" element={<Survey />} />

      <Route path="/surgeon" element={<Surgeon />} />
      <Route path="/surgeon-test" element={<SurgeonTester />} />
      <Route path="/formtest" element={<FormTest />} />
      <Route path="/ptlandtest" element={<PtLandTest />} />
    </Routes>
  );
};
