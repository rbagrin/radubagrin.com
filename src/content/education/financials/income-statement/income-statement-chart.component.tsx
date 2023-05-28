import React from "react";
import { cardStyle } from "../income-statement.style";

export const IncomeStatementChart = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#333",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Column1 />
        <Column2 />
        <Column3 />
        <Column4 />
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            ...cardStyle,
            width: "20%",
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "rgba(134, 50, 179, 0.65)",
          }}
        >
          Top Line
        </div>
        <div
          style={{
            ...cardStyle,
            width: "20%",
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "rgba(134, 50, 179, 0.65)",
          }}
        >
          Bottom Line
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontSize: "16px",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid black",
            padding: "5px",
            paddingRight: "20px",
            paddingLeft: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            backgroundColor: "rgba(80, 80, 80, 0.5)",
            minWidth: "20%",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            Gross margin =
          </div>
          <div>
            <div style={{ textAlign: "center" }}>Gross Profit</div>
            <hr />
            <div style={{ textAlign: "center" }}>Revenue</div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "10px",
            border: "1px solid black",
            padding: "5px",
            paddingRight: "20px",
            paddingLeft: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            backgroundColor: "rgba(80, 80, 80, 0.5)",
            minWidth: "20%",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            Operating Margin =
          </div>
          <div>
            <div style={{ textAlign: "center" }}>Operating Income</div>
            <hr />
            <div style={{ textAlign: "center" }}>Revenue</div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "10px",
            border: "1px solid black",
            padding: "5px",
            paddingRight: "20px",
            paddingLeft: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            backgroundColor: "rgba(80, 80, 80, 0.5)",
            minWidth: "20%",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            Net Margin =
          </div>
          <div>
            <div style={{ textAlign: "center" }}>Net Income</div>
            <hr />
            <div style={{ textAlign: "center" }}>Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Column1 = () => (
  <div
    style={{
      width: "20%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    }}
  >
    <div
      style={{
        ...cardStyle,
        height: "600px",
        backgroundColor: "rgba(0, 154, 244, 0.7)",
      }}
    >
      REVENUE
    </div>
  </div>
);
const Column2 = () => (
  <div
    style={{
      width: "20%",
      height: "600px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        ...cardStyle,
        height: "210px",
        backgroundColor: "rgba(235, 100, 82, 0.75)",
      }}
    >
      COST OF GOODS SOLD
    </div>

    <div
      style={{
        ...cardStyle,
        height: "370px",
        backgroundColor: "rgba(102, 180, 209, 0.6)",
      }}
    >
      GROSS PROFIT
    </div>
  </div>
);

const Column3 = () => (
  <div
    style={{
      width: "20%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: "230px" }}></div>
    <div
      style={{
        height: "370px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          ...cardStyle,
          height: "90px",
          backgroundColor: "rgba(255, 50, 50, 0.65)",
        }}
      >
        OPERATING EXPENSES
      </div>

      <div
        style={{
          ...cardStyle,
          height: "260px",
          backgroundColor: "rgba(92, 214, 92, 0.5)",
        }}
      >
        OPERATING INCOME
      </div>
    </div>
  </div>
);

const Column4 = () => (
  <div
    style={{
      width: "20%",
      height: "600px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: "340px" }}></div>
    <div
      style={{
        height: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          ...cardStyle,
          height: "80px",
          backgroundColor: "rgba(255, 25, 25, 0.55)",
        }}
      >
        INTEREST & TAXES
      </div>

      <div
        style={{
          ...cardStyle,
          height: "160px",
          backgroundColor: "rgba(50, 255, 50, 0.45)",
        }}
      >
        NET INCOME
      </div>
    </div>
  </div>
);
