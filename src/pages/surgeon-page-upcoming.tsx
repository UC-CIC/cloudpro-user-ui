import React, { useEffect, useState } from "react";

import { SrgnCompliance } from "../components/srgndash/srgn-compliance"
import { SrgnUpcomingGrouping } from "../components/srgndash/srgn-pt-upc-grouping"
import { SrgnFilter } from "../components/srgndash/srgn-filter"

export const SurgeonPageUpcoming: React.FC = () => {
  return (
    <>
      <SrgnCompliance/>
      <SrgnFilter/>

      <SrgnUpcomingGrouping/>
    </>
  );
};
