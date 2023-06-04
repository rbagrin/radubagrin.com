import React, { useMemo, useState } from "react";
import { keepOnlyXDigits } from "../../../util/number.util";
import { LineChart } from "../../../components/LineChart";
import {
  IMBOBILIARE_1_CAMERA_BUCURESTI,
  IMOBILIARE_2_CAMERE_BUCURESTI,
  IMOBILIARE_3_CAMERE_BUCURESTI,
  IMOBILIARE_APARTAMENTE_VECHI_SI_NOI_BUCURESTI,
  IMOBILIARE_INDEX_ROMANIA,
} from "./imobiliare";
import { Input } from "../../../components/forms/Input";

const GrossRentalYield = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const [purchasePrice, setPurchasePrice] = useState<number | "">(100_000);

  // TODO: add example section
  const grossRentalYield = useMemo(() => {
    return keepOnlyXDigits(
      (12 * Number(monthlyRent) * 100) / Number(purchasePrice),
      2
    );
  }, [monthlyRent, purchasePrice]);

  return (
    <div style={{ width: "100%" }}>
      <h3>Gross Rental Yield</h3>
      <code>GrossRentalYield = annualRent * 100% / purchasePrice;</code>

      <h4>What is a good rental yield – and where can I get it?</h4>
      <p>
        As a rule of thumb, between <b>6%</b> and <b>8%</b> is considered to be
        a <b>reasonable</b> level of rental yield, but different parts of the
        country can deliver significantly higher or lower returns. It is worth
        bearing in mind that yields can be lower in areas where the expected
        house price growth is highest, such as in London and the South East of
        England. This is because the potential for capital gains in the region
        pushes sale prices up, while rent levels are less affected.
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <Input
          name="purchasePrice"
          label="Purchase price:"
          type="number"
          value={purchasePrice}
          setValue={setPurchasePrice}
        />
        <Input
          name="monthlyRent"
          label="Monthly rent:"
          type="number"
          value={monthlyRent}
          setValue={setMonthlyRent}
        />
      </div>
      <p>Gross Rental Yield: {grossRentalYield}%</p>
    </div>
  );
};

const NetRentalYield = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const [purchasePrice, setPurchasePrice] = useState<number | "">(100_000);
  const [runningCosts, setRunningCosts] = useState<number | "">(50);
  const [oneTimeCosts, setOneTimeCosts] = useState<number | "">(100);

  // TODO: add example section
  const netRentalYield = useMemo(() => {
    const mr = Number(monthlyRent);
    const rc = Number(runningCosts);
    const pp = Number(purchasePrice);
    const otc = Number(oneTimeCosts);
    return keepOnlyXDigits(((12 * mr - mr - rc) / (pp + otc)) * 100, 2);
  }, [monthlyRent, purchasePrice, oneTimeCosts, runningCosts]);

  return (
    <div style={{ width: "100%" }}>
      <h3>Net Rental Yield</h3>
      <code>
        NetRentalYield = ((annualRent - 1monthRent - runningCosts) /
        (purchasePrice + oneTimeCosts)) * 100%
      </code>

      <p>Suggested values:</p>
      <ul>
        <li>Running costs = 10% * annualRent</li>
        <li>
          One time costs (Mortgage arrangement fee / Solicitor's cost /
          Maintenance) = ~5000
        </li>
      </ul>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <Input
            name="purchasePrice"
            label="Purchase price:"
            type="number"
            value={purchasePrice}
            setValue={setPurchasePrice}
          />
          <Input
            name="monthlyRent"
            label="Monthly rent:"
            type="number"
            value={monthlyRent}
            setValue={setMonthlyRent}
          />
        </div>
        <div>
          <Input
            name="runningCosts"
            label="Running costs:"
            type="number"
            value={runningCosts}
            setValue={setRunningCosts}
          />
          <Input
            name="oneTimeCosts"
            label="One time costs:"
            type="number"
            value={oneTimeCosts}
            setValue={setOneTimeCosts}
          />
        </div>
      </div>
      <p>Net Rental Yield: {netRentalYield}%</p>
    </div>
  );
};
export const RealEstateSection = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);

  // TODO: add example section
  const fairPrice = useMemo(() => 15 * 12 * Number(monthlyRent), [monthlyRent]);

  return (
    <div>
      <h1>Real estate</h1>
      <h2>Fair value</h2>
      <code>FairPrice = 15Years * monthlyRent</code>
      <div>
        <Input
          name="monthlyRent"
          label="Monthly rent:"
          type="number"
          value={monthlyRent}
          setValue={setMonthlyRent}
        />

        <p>Fair price: ${fairPrice}</p>
      </div>
      <hr />
      <h2>Rental yields</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <GrossRentalYield />
        <NetRentalYield />
      </div>

      <GraficeImobiliareRo />
    </div>
  );
};

const GraficeImobiliareRo = () => (
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
