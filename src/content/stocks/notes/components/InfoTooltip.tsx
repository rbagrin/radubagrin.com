import React, { ReactNode } from "react";
import "./info-tooltip.css";
import { ReactComponent as InfoCircle } from "../../../../icons/info-circle.svg";

export const InfoTooltip = ({ text }: { text: ReactNode }) => {
  return (
    <div className="tooltip">
      <span className="tooltipText">{text}</span>
      <InfoCircle width={20} height={20} fill="rgba(113, 53, 193, 1)" />
    </div>

    // <span data-text={text} className="tooltip">
    //   <InfoCircle width={20} height={20} fill="rgba(113, 53, 193, 1)" />
    // </span>
  );
};
