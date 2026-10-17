import Link from "next/link";

const carriers = [
  {
    name: "BlueDart",
    type: "Express Logistics",
    rating: "98.2%",
    color: "blue",
  },
  {
    name: "Delhivery",
    type: "Domestic Logistics",
    rating: "96.8%",
    color: "purple",
  },
  {
    name: "DHL",
    type: "International Express",
    rating: "97.5%",
    color: "orange",
  },
  {
    name: "FedEx",
    type: "Global Express",
    rating: "95.9%",
    color: "green",
  },
];

export default function CarriersPage() {
  return (
    <main className="carriers-page">
      <div className="carriers-topbar">
        <Link href="/" className="carriers-back">
          ← Back to Overview
        </Link>

        <span className="carriers-live">
          <span /> Operations overview
        </span>
      </div>

      <header className="carriers-header">
        <p className="carriers-eyebrow">PULSE OPERATIONS / NETWORK</p>
        <h1>Carrier Management</h1>
        <p>
          Monitor delivery partners, compare performance, and keep
          shipments moving smoothly.
        </p>
      </header>

      <section className="carriers-stats" aria-label="Carrier statistics">
        <article className="carrier-stat-card">
          <span>Active carriers</span>
          <strong>04</strong>
          <small>Across the delivery network</small>
        </article>

        <article className="carrier-stat-card">
          <span>On-time delivery</span>
          <strong>97.1%</strong>
          <small>Illustrative performance metric</small>
        </article>

        <article className="carrier-stat-card">
          <span>Network coverage</span>
          <strong>08</strong>
          <small>Supported origin and destination cities</small>
        </article>
      </section>

      <section className="carriers-panel">
        <div className="carriers-panel-heading">
          <div>
            <h2>Delivery partners</h2>
            <p>Carrier directory and sample performance indicators.</p>
          </div>

          <span className="carriers-count">4 partners</span>
        </div>

        <div className="carriers-grid">
          {carriers.map((carrier) => (
            <article className="carrier-card" key={carrier.name}>
              <div className={`carrier-logo ${carrier.color}`}>
                {carrier.name.slice(0, 1)}
              </div>

              <div className="carrier-card-content">
                <div className="carrier-card-title">
                  <h3>{carrier.name}</h3>
                  <span className="carrier-active-badge">
                    Active
                  </span>
                </div>

                <p>{carrier.type}</p>

                <div className="carrier-performance">
                  <span>On-time delivery</span>
                  <strong>{carrier.rating}</strong>
                </div>

                <div
                  className="carrier-progress"
                  role="progressbar"
                  aria-label={`${carrier.name} on-time delivery rate`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number.parseFloat(carrier.rating)}
                >
                  <span
                    style={{ width: carrier.rating }}
                  />
                </div>

                <Link
                  href={`/?carrier=${encodeURIComponent(carrier.name)}#shipments`}
                  className="carrier-view-link"
                >
                  View shipments →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="carriers-disclaimer">
        Performance percentages are illustrative demo values, not
        verified carrier statistics.
      </p>
    </main>
  );
}