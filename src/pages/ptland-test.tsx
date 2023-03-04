import React from "react";
import { PageLayout } from "../components/page-layout";

import { PtNav } from "../components/ptdash/pt-nav"

export const PtLandTest: React.FC = () => (
  <PageLayout>
    <PtNav hospital="testhosp" surgdate="2022-10-10" surgeon="Dr. Doctor" />
  </PageLayout>
);