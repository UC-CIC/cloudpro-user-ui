import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateRoutes from './components/PrivateRoutes';
import PublicRoutes from './components/PublicRoutes';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import PatientHome from './pages/PatientHome';
import { PtReporting } from './pages/pt-reporting-page';
import { RegisterPage } from './pages/register-page';
import { Registered as RegisteredPage } from './pages/registered';
import { Surgeon } from './pages/surgeon-page';
import { Survey } from './pages/survey-page';
import { Audit } from './pages/audit-page';
import QOL from './pages/qol';

export const App: React.FC = () => {
  const { isEmployee, isLoading } = useAuth();

  // TODO: HANDLE LOADING STATE
  if (isLoading) return <div />;

  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registered" element={<RegisteredPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        {isEmployee ? (
          <>
            <Route path="/home" element={<Surgeon />} />
            <Route path="*" element={<Navigate replace to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<PatientHome />} />
            <Route path="/qol" element={<QOL />} />
            <Route path="/pt-authed-reporting" element={<PtReporting />} />
            <Route path="/survey/:propack/:stateHash" element={<Survey />} />
            <Route path="/audit/:sid" element={<Audit />} />
            <Route path="*" element={<Navigate replace to="/home" />} />
          </>
        )}
      </Route>
    </Routes>
  );
};
