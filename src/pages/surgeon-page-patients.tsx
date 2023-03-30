import React, { useEffect, useState } from "react";

import { SrgnCompliance } from "../components/srgndash/srgn-compliance"
import { SrgnFilter } from "../components/srgndash/srgn-filter"


export const SurgeonPagePatients: React.FC = () => {
  return (
    <>
      <SrgnCompliance/>
      <SrgnFilter/>
      <div> my patients </div>
    </>
  );
};
