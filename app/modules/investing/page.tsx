import Link from "next/link";

// Dummy data for now — matches the shape returned by GET /api/v1/stocks,
// which the mobile app (and eventually this page) will call once this
// module is wired up to a real market-data provider.
const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 231.42, changePercent: 1.2 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 468.11, changePercent: -0.4 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 178.9, changePercent: 3.1 },
];

export default function InvestingModulePage() {
  const maxChange = Math.max(...stocks.map((s) => Math.abs(s.changePercent)));

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <Link href="/modules" className="font-mono text-sm text-accent">
          &larr; modules
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Investing
          </h1>
          <span className="rounded-full border border-status-dummy/40 bg-status-dummy/10 px-2.5 py-1 font-mono text-xs text-status-dummy">
            preview data
          </span>
        </div>
        <p className="mt-3 max-w-xl text-fg-muted">
          Dummy watchlist — wire this up to a real market-data API and the
          Prisma-backed watchlist table when ready.
        </p>

        <div className="mt-10 divide-y divide-border rounded-lg border border-border bg-surface">
          {stocks.map((stock) => {
            const isUp = stock.changePercent >= 0;
            const barWidth = (Math.abs(stock.changePercent) / maxChange) * 100;
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-mono text-sm font-medium">{stock.symbol}</p>
                  <p className="text-sm text-fg-muted">{stock.name}</p>
                </div>

                <div className="flex w-40 items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${isUp ? "bg-status-active" : "bg-status-dummy"}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span
                    className={`w-14 text-right font-mono text-sm ${isUp ? "text-status-active" : "text-status-dummy"}`}
                  >
                    {isUp ? "+" : ""}
                    {stock.changePercent.toFixed(1)}%
                  </span>
                </div>

                <p className="w-20 text-right font-mono text-sm">
                  ${stock.price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
