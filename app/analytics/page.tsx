import Link from "next/link";
import { headers } from "next/headers";


const statusBreakdown = [
  { label: "Delivered", count: 321, color: "delivered" },
  { label: "In Transit", count: 321, color: "transit" },
  { label: "Delayed", count: 321, color: "delayed" },
  { label: "Exception", count: 321, color: "exception" },
];



export default async function AnalyticsPage() {
  let shipments: {
    id: string;
    origin: string;
    destination: string;
    carrier: string;
    status: string;
    eta: string;
  }[] = [];

  let dataError = false;

  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");

    if (!host) {
      throw new Error("Request host is unavailable");
    }

    const protocol =
      process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(
      `${protocol}://${host}/api/shipments?limit=100`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Unable to fetch shipments");
    }

    const result = await response.json();
    const total = result.pagination?.total ?? 0;

    // Fetch every page so the metrics represent the full dataset.
    let cursor = result.pagination?.nextCursor ?? null;

    shipments = [...(result.data ?? [])];

    while (cursor !== null) {
      const pageResponse = await fetch(
        `${protocol}://${host}/api/shipments?limit=100&cursor=${encodeURIComponent(cursor)}`,
        { cache: "no-store" }
      );

      if (!pageResponse.ok) {
        throw new Error("Unable to fetch all shipment pages");
      }

      const pageResult = await pageResponse.json();

      shipments.push(...(pageResult.data ?? []));
      cursor = pageResult.pagination?.nextCursor ?? null;
    }

    if (shipments.length !== total) {
      throw new Error("Shipment data is incomplete");
    }
  } catch {
    dataError = true;
  }
    const totalShipments = shipments.length;

  const countByStatus = (status: string) =>
    shipments.filter((shipment) => shipment.status === status).length;

  const deliveredCount = countByStatus("Delivered");
  const inTransitCount = countByStatus("In Transit");
  const delayedCount = countByStatus("Delayed");
  const exceptionCount = countByStatus("Exception");

  const percentage = (count: number) =>
    totalShipments === 0
      ? "0%"
      : `${((count / totalShipments) * 100).toFixed(1)}%`;

  const carrierNames = ["BlueDart", "DHL", "Delhivery", "FedEx"];

  const carrierPerformance = carrierNames.map((name) => {
    const carrierShipments = shipments.filter(
      (shipment) => shipment.carrier === name
    );

    const delivered = carrierShipments.filter(
      (shipment) => shipment.status === "Delivered"
    ).length;

    return {
      name,
      rate:
        carrierShipments.length === 0
          ? 0
          : Number(
              ((delivered / carrierShipments.length) * 100).toFixed(1)
            ),
    };
  });

  const shipmentStats = [
    {
      label: "Total Shipments",
      value: dataError ? "—" : totalShipments.toLocaleString(),
      change: dataError ? "Data unavailable" : "Across the delivery network",
      icon: "▦",
      style: "analytics-purple",
    },
    {
      label: "Delivered",
      value: dataError ? "—" : percentage(deliveredCount),
      change: dataError ? "Data unavailable" : `${deliveredCount} shipments`,
      icon: "✓",
      style: "analytics-green",
    },
    {
      label: "In Transit",
      value: dataError ? "—" : percentage(inTransitCount),
      change: dataError ? "Data unavailable" : `${inTransitCount} shipments`,
      icon: "⇄",
      style: "analytics-blue",
    },
    {
      label: "Exceptions",
      value: dataError ? "—" : percentage(exceptionCount),
      change: dataError ? "Data unavailable" : `${exceptionCount} shipments`,
      icon: "!",
      style: "analytics-orange",
    },
  ];

 
  
  return (
    <main className="analytics-page">
      <div className="analytics-topbar">
        <Link href="/" className="analytics-back">
          ← Back to Overview
        </Link>

        <span className="analytics-live">
          <span /> Operations insights
        </span>
      </div>

      <header className="analytics-header">
        <p className="analytics-eyebrow">
          PULSE OPERATIONS / INSIGHTS
        </p>

        <h1>Analytics & Performance</h1>

        <p>
          Understand shipment health, monitor delivery performance,
          and identify opportunities to improve your logistics network.
        </p>
      </header>

      <section
        className="analytics-stats"
        aria-label="Shipment performance summary"
      >
        {shipmentStats.map((stat) => (
          <article className="analytics-stat-card" key={stat.label}>
            <div className="analytics-stat-top">
              <span>{stat.label}</span>
              <span className={`analytics-stat-icon ${stat.style}`}>
                {stat.icon}
              </span>
            </div>

            <strong>{stat.value}</strong>
            <small>{stat.change}</small>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Shipment distribution</h2>
              <p>Breakdown by current shipment status</p>
            </div>
          </div>

          <div className="analytics-status-list">
            {statusBreakdown.map((status) => (
              <div className="analytics-status-row" key={status.label}>
                <div className="analytics-status-label">
                  <span
                    className={`analytics-status-dot ${status.color}`}
                  />
                  <span>{status.label}</span>
                </div>

                <strong>{status.count}</strong>
              </div>
            ))}
          </div>

          <p className="analytics-note">
            Illustrative breakdown for the dashboard demo.
          </p>
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Carrier performance</h2>
              <p>Delivered shipments by carrier</p>
            </div>

            <Link href="/carriers" className="analytics-view-link">
              View carriers →
            </Link>
          </div>

          <div className="analytics-carrier-list">
            {carrierPerformance.map((carrier) => (
              <div className="analytics-carrier-row" key={carrier.name}>
                <div className="analytics-carrier-info">
                  <span>{carrier.name}</span>
                  <strong>{carrier.rate}%</strong>
                </div>

                <div
                  className="analytics-progress"
                  role="progressbar"
                  aria-label={`${carrier.name} on-time delivery rate`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={carrier.rate}
                >
                  <span style={{ width: `${carrier.rate}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="analytics-note">
            These percentages are demo values, not verified carrier statistics.
          </p>
        </article>
      </section>

      <section className="analytics-panel analytics-trend-panel">
        <div className="analytics-panel-heading">
          <div>
            <h2>Network overview</h2>
            <p>Shipment volume across the delivery network</p>
          </div>

          <span className="analytics-demo-badge">DEMO DATA</span>
        </div>

        <div
          className="analytics-bars"
          role="img"
          aria-label="Illustrative shipment volume chart for Monday through Sunday"
        >
          {[
            { day: "Mon", height: 42 },
            { day: "Tue", height: 66 },
            { day: "Wed", height: 53 },
            { day: "Thu", height: 82 },
            { day: "Fri", height: 61 },
            { day: "Sat", height: 91 },
            { day: "Sun", height: 72 },
          ].map((item) => (
            <div className="analytics-bar-column" key={item.day}>
              <div className="analytics-bar-track">
                <span style={{ height: `${item.height}%` }} />
              </div>

              <span className="analytics-bar-label">{item.day}</span>
            </div>
          ))}
        </div>

        <p className="analytics-note">
          The chart illustrates the layout; its values are not live shipment
          measurements.
        </p>
      </section>
    </main>
  );
}