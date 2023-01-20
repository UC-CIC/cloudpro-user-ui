import React from "react";
import { PageLayout } from "../components/page-layout";

export const HomePage: React.FC = () => (
  <PageLayout>
    <div>
        <h1 id="page-title" className="content__title">
          Home
        </h1>
        <p><em>Menu</em></p>
        <a href="/questionnaire">Questionnaire</a>
    </div>
  </PageLayout>
);