import React from 'react';
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { Questionnaire } from './pages/questionnaire-page';

export const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
    </Routes>
  );
};
