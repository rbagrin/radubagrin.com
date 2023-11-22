import { LineChart } from "../../../../components/LineChart";
import {
  IMBOBILIARE_1_CAMERA_BUCURESTI,
  IMOBILIARE_2_CAMERE_BUCURESTI,
  IMOBILIARE_3_CAMERE_BUCURESTI,
  IMOBILIARE_APARTAMENTE_VECHI_SI_NOI_BUCURESTI,
} from "../imobiliare";
import React from "react";
import { IMOBILIARE_INDEX_ROMANIA } from "../imobiliare-romania";

export const GraficeImobiliareRo = () => (
  <div>
    <LineChart
      title="Indicele imobiliare ROMANIA"
      chartData={IMOBILIARE_INDEX_ROMANIA}
    />
    <LineChart
      title="Apartamente vechi si noi BUCURESTI"
      chartData={IMOBILIARE_APARTAMENTE_VECHI_SI_NOI_BUCURESTI}
    />
    <LineChart
      title="Apartamente cu 1 camera BUCURESTI"
      chartData={IMBOBILIARE_1_CAMERA_BUCURESTI}
    />
    <LineChart
      title="Apartamente cu 2 camere BUCURESTI"
      chartData={IMOBILIARE_2_CAMERE_BUCURESTI}
    />
    <LineChart
      title="Apartamente cu 3 camere BUCURESTI"
      chartData={IMOBILIARE_3_CAMERE_BUCURESTI}
    />
  </div>
);
