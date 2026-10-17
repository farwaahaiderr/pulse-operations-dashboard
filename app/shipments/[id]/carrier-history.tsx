"use client";

import { useEffect, useState } from "react";

type HistoryEvent = {
  id: number;
  status: string;
  location: string;
  timestamp: string;
  description: string;
};

type CarrierHistoryProps = {
  shipmentId: string;
};

export default function CarrierHistory({
  shipmentId,
}: CarrierHistoryProps) {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `/api/shipments/${encodeURIComponent(shipmentId)}/history`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to load carrier history.");
        }

        const result = await response.json();

        if (!cancelled) {
          setHistory(result.history);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [shipmentId, retryCount]);

  if (loading) {
    return (
      <section className="carrier-history" aria-busy="true">
        <h2>Carrier History</h2>
        <p role="status">Loading tracking history...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="carrier-history" role="alert">
        <h2>Carrier History</h2>
        <p>
          We couldn't load the tracking history, but your shipment details
          are still available.
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Retry History
        </button>
      </section>
    );
  }

  return (
    <section className="carrier-history" aria-labelledby="history-heading">
      <h2 id="history-heading">Carrier History</h2>
      <p className="history-subtitle">
        Tracking updates for shipment {shipmentId}
      </p>

      {history.length === 0 ? (
        <p>No carrier updates are available yet.</p>
      ) : (
        <ol className="history-list">
          {history.map((event) => (
            <li key={event.id} className="history-item">
              <span className="history-dot" aria-hidden="true" />
              <div>
                <h3>{event.status}</h3>
                <p>{event.description}</p>
                <p className="history-location">{event.location}</p>
                <time>{event.timestamp}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}