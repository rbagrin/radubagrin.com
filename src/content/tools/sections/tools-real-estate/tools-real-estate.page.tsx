import React from "react";
import { MAX_PAGE_WIDTH } from "../../../../css-style/style";
import { RealEstateSection } from "./real-estate.section";

export const ToolsRealEstatePage = () => {
  return (
    <div style={{ width: "100%", maxWidth: MAX_PAGE_WIDTH }}>
      <RealEstateSection />
    </div>
  );
};
