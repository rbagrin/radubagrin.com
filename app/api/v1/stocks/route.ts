/**
 * GET /api/v1/stocks
 * Dummy data for now. When the Investing module goes live, replace the
 * hardcoded array below with a call to a real market-data provider
 * (e.g. Alpha Vantage, Finnhub, Polygon) — the route's shape can stay
 * the same, so neither the web app nor the mobile app has to change.
 */
export async function GET() {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 231.42, changePercent: 1.2 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 468.11, changePercent: -0.4 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 178.9, changePercent: 3.1 },
  ];

  return Response.json({ stocks });
}
