import React, { useState } from "react";
import { Switch } from "./components/Switch";
import { InfoModal } from "./components/InfoModal";
import { ReactComponent as InfoCircle } from "../../../icons/info-circle.svg";
import { Content } from "../../../util/components/content.component";
import { Typography } from "@mui/material";

interface StockData {
  stock: string;
  revenue: boolean; // growth
  netIncome: boolean; // growth
  operatingExpenses: boolean; // stable or smaller growth than revenue
  assetsVsLiabilities: boolean; // > 1.5
  currentAssetsVsCurrentLiabilities: boolean; // > 1.5
  cashVsCurrentLiabilities: boolean; // >80%
  longTermDebt: boolean; // as low as possible
  equity: boolean; // growth
}

const InitStockData = {
  revenue: false,
  netIncome: false,
  operatingExpenses: false,
  assetsVsLiabilities: false,
  currentAssetsVsCurrentLiabilities: false,
  cashVsCurrentLiabilities: false,
  longTermDebt: false,
  equity: false,
};

export const NotesPage = () => {
  return (
    <Content>
      <header style={{ width: "100%", height: "50px", paddingLeft: "10px" }}>
        <Typography variant="h4">Notes</Typography>
      </header>

      <StockNotesTable
        rows={[
          { stock: "GOOGL", ...InitStockData },
          { stock: "AMZN", ...InitStockData },
          { stock: "ADBE", ...InitStockData },
          { stock: "NET", ...InitStockData },
          { stock: "DOCN", ...InitStockData },
          { stock: "MONGO_DB", ...InitStockData },
        ]}
      />
    </Content>
  );
};

const style = (value) => ({
  backgroundColor: value
    ? "rgba(69, 168, 69, 0.45)"
    : "rgba(220, 74, 74, 0.45)",
});
const HeaderCellStyle = {
  backgroundColor: "rgba(134, 3, 158, 0.64)",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
};
const StyleHeaderCellContent = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
};

const StockNotesTable = ({ rows }: { rows: StockData[] }) => {
  const [modalContent, setModalContent] = useState<{
    title: string;
    text: string;
  } | null>(null);
  return (
    <div style={{ overflowX: "auto" }}>
      {modalContent && (
        <InfoModal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
        >
          <h2 style={{ textAlign: "center" }}>{modalContent.title}</h2>
          <p>{modalContent.text}</p>
        </InfoModal>
      )}
      <table style={{ color: "black", backgroundColor: "blue" }}>
        <thead>
          <tr>
            <th style={HeaderCellStyle}>Stock</th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>REVENUE</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "REVENUE",
                      text: "What investors typically do is take a look at the trend of the revenue over a longer period of time. They either look at the trailing twelve months (TTM) revenue growth or the yearly revenue growth to see a more zoomed out picture. This can also be a great practice when looking at a company’s fundamentals. ",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>NET INCOME</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "NET INCOME",
                      text: "Net Income is meant to show investors how much value the company is creating over time for shareholders, which is where it excels. For this reason, many investors believe that a company growing its net income is the #1 way to increase its share price.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>OPERATING EXPENSES</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "OPERATING EXPENSES",
                      text: "If the operating expenses are staying the same or even declining while revenue is growing, then that is typically seen as a good thing to investors as it means the company is spending less to produce either the same or more revenue.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>

            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>ASSETS vs LIABILITIES</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "ASSETS vs LIABILITIES",
                      text: "Typically investors like to see companies with more assets than liabilities, because it can signal that the company isn’t over leveraging itself, and in a stronger financial position.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>CURRENT ASSETS vs CURRENT LIABILITIES</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "CURRENT ASSETS vs CURRENT LIABILITIES",
                      text: "Typically investors like to see companies with more current assets than current liabilities.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>CASH vs CURRENT LIABILITIES</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "CASH vs CURRENT LIABILITIES",
                      text: "If CASH > CURRENT LIABILITIES it means the company can pay all it's current liabilities if it wishes to do so.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>LONG TERM DEBT</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "LONG TERM DEBT",
                      text: "Low long term debt is a good sign.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
            <th style={HeaderCellStyle}>
              <div style={StyleHeaderCellContent}>
                <div>BOOK VALUE</div>
                <div
                  onClick={() =>
                    setModalContent({
                      title: "BOOK VALUE",
                      text: "It's always great to see a company's book value increasing over time, because it means the company is growing its assets more quickly than its liabilities. The faster the rate of growth to the book value, the better.",
                    })
                  }
                >
                  <InfoCircle
                    width={20}
                    height={20}
                    fill="rgba(113, 53, 193, 1)"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <TableRow stockData={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ stockData }: { stockData: StockData }) => {
  const [updatedRow, setUpdatedRow] = useState<StockData>(stockData);

  const updateProperty = (prop: string) => {
    setUpdatedRow((prev) => ({ ...prev, [prop]: !prev[prop] }));
  };

  return (
    <tr>
      <td
        style={{
          backgroundColor: "rgba(86, 12, 100, 0.46)",
          fontWeight: "bold",
        }}
      >
        {updatedRow.stock}
      </td>
      <td style={style(updatedRow.revenue)}>
        <div>
          <Switch
            value={updatedRow.revenue}
            updateValue={() => updateProperty("revenue")}
          />
        </div>
      </td>
      <td style={style(updatedRow.netIncome)}>
        <Switch
          value={updatedRow.netIncome}
          updateValue={() => updateProperty("netIncome")}
        />
      </td>
      <td style={style(updatedRow.operatingExpenses)}>
        <Switch
          value={updatedRow.operatingExpenses}
          updateValue={() => updateProperty("operatingExpenses")}
        />
      </td>
      <td style={style(updatedRow.assetsVsLiabilities)}>
        <Switch
          value={updatedRow.assetsVsLiabilities}
          updateValue={() => updateProperty("assetsVsLiabilities")}
        />
      </td>
      <td style={style(updatedRow.currentAssetsVsCurrentLiabilities)}>
        <Switch
          value={updatedRow.currentAssetsVsCurrentLiabilities}
          updateValue={() =>
            updateProperty("currentAssetsVsCurrentLiabilities")
          }
        />
      </td>
      <td style={style(updatedRow.cashVsCurrentLiabilities)}>
        <Switch
          value={updatedRow.cashVsCurrentLiabilities}
          updateValue={() => updateProperty("cashVsCurrentLiabilities")}
        />
      </td>
      <td style={style(updatedRow.longTermDebt)}>
        <Switch
          value={updatedRow.longTermDebt}
          updateValue={() => updateProperty("longTermDebt")}
        />
      </td>
      <td style={style(updatedRow.equity)}>
        <Switch
          value={updatedRow.equity}
          updateValue={() => updateProperty("equity")}
        />
      </td>
    </tr>
  );
};
