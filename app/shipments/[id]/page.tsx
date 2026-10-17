import { Suspense } from "react";
import Link from "next/link";
import CarrierHistory from "./carrier-history";
import CarrierHistoryBoundary from "./carrier-history-boundary";

type Shipment = {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: string;
  eta: string;
};

async function getShipment(id: string): Promise<Shipment | null> {
  const response = await fetch(
    "http://localhost:3000/api/shipments?limit=1284",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Unable to load shipment details.");
  }

  const result: { data: Shipment[] } = await response.json();

  return result.data.find((shipment) => shipment.id === id) ?? null;
}

function CarrierHistorySkeleton() {
  return (
    <section
      className="carrier-history"
      aria-label="Carrier history loading"
      aria-busy="true"
    >
      <h2>Carrier History</h2>
      <p role="status">Loading tracking history...</p>

      <div className="history-skeleton" aria-hidden="true" />
      <div className="history-skeleton" aria-hidden="true" />
      <div className="history-skeleton" aria-hidden="true" />
    </section>
  );
}

export default async function ShipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getShipment(id);

  if (!shipment) {
    return (
      <main className="shipment-detail-page">
        <h1>Shipment not found</h1>
        <Link href="/">← Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="shipment-detail-page">
      <Link href="/">← Back to dashboard</Link>

      <header>
        <p>SHIPMENT DETAILS</p>
        <h1>{shipment.id}</h1>

        <span
          className={`status-badge ${shipment.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {shipment.status}
        </span>
      </header>

      <section>
        <h2>Shipment information</h2>

        <div>
          <p>Origin</p>
          <strong>{shipment.origin}</strong>
        </div>

        <div>
          <p>Destination</p>
          <strong>{shipment.destination}</strong>
        </div>

        <div>
          <p>Carrier</p>
          <strong>{shipment.carrier}</strong>
        </div>

        <div>
          <p>Estimated delivery</p>
          <strong>{shipment.eta}</strong>
        </div>
      </section>

      <CarrierHistoryBoundary>
        <Suspense fallback={<CarrierHistorySkeleton />}>
          <CarrierHistory shipmentId={shipment.id} />
        </Suspense>
      </CarrierHistoryBoundary>
    </main>
  );
}