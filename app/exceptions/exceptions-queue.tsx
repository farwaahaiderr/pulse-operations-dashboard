"use client";

import { useCallback, useEffect, useState } from "react";

type ExceptionShipment = {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: "Open" | "Resolved" | "Escalated";
  reason: string;
  priority: "High" | "Medium" | "Low";
};

export default function ExceptionsQueue() {
  const [shipments, setShipments] = useState<ExceptionShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const loadExceptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exceptions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load exceptions.");
      }

      const result: { data: ExceptionShipment[] } =
        await response.json();

      setShipments(result.data);
    } catch {
      setError("We couldn't load the exception queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExceptions();
  }, [loadExceptions]);

  async function updateShipment(
    id: string,
    action: "resolve" | "escalate"
  ) {
    const shipment = shipments.find((item) => item.id === id);

    if (!shipment || shipment.status !== "Open") {
      return;
    }

    // Save the previous state so we can roll back on failure.
   const previousShipment = shipments.find(
  (item) => item.id === id
);

    const optimisticStatus =
      action === "resolve" ? "Resolved" : "Escalated";

    // Update the UI immediately, before the API responds.
    setShipments((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: optimisticStatus }
          : item
      )
    );

    setPendingIds((current) => [...current, id]);
    setNotice("");

    try {
      const response = await fetch(
        `/api/exceptions/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        throw new Error("The action could not be completed.");
      }

      const result: { data: ExceptionShipment } =
        await response.json();

      setShipments((current) =>
        current.map((item) =>
          item.id === id ? result.data : item
        )
      );

      setNotice(
        action === "resolve"
          ? `${id} marked as resolved.`
          : `${id} escalated successfully.`
      );
    } catch {
      // Restore the previous UI if the API request fails.
      if (previousShipment) {
  setShipments((current) =>
    current.map((item) =>
      item.id === id ? previousShipment : item
    )
  );
}

      setNotice(
        `Couldn't update ${id}. Its previous status has been restored. Please try again.`
      );
    } finally {
      setPendingIds((current) =>
        current.filter((pendingId) => pendingId !== id)
      );
    }
  }

  return (
    <main className="exceptions-page">
      <a href="/">← Back to dashboard</a>

      <header className="exceptions-header">
        <p className="exceptions-eyebrow">PULSE OPERATIONS</p>
        <h1>Exception Queue</h1>
        <p>
          Review shipments that need attention and take action.
        </p>
      </header>

      <section className="exceptions-summary">
        <div>
          <span>Total exceptions</span>
          <strong>{shipments.length}</strong>
        </div>

        <div>
          <span>Open</span>
          <strong>
            {shipments.filter((item) => item.status === "Open").length}
          </strong>
        </div>

        <div>
          <span>Escalated</span>
          <strong>
            {
              shipments.filter(
                (item) => item.status === "Escalated"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Resolved</span>
          <strong>
            {
              shipments.filter(
                (item) => item.status === "Resolved"
              ).length
            }
          </strong>
        </div>
      </section>

      {notice && (
        <p className="exceptions-notice" role="status">
          {notice}
        </p>
      )}

      <section
        className="exceptions-card"
        aria-labelledby="exceptions-list-heading"
      >
        <div className="exceptions-card-heading">
          <div>
            <h2 id="exceptions-list-heading">Shipments requiring attention</h2>
            <p>Resolve an issue or escalate it for further review.</p>
          </div>

          <button
            type="button"
            onClick={() => void loadExceptions()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="exceptions-message" role="status">
            Loading exceptions...
          </p>
        ) : error ? (
          <div className="exceptions-message" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => void loadExceptions()}>
              Try again
            </button>
          </div>
        ) : shipments.length === 0 ? (
          <p className="exceptions-message">
            No exceptions found. Everything looks good!
          </p>
        ) : (
          <div className="exceptions-table-wrapper">
            <table className="exceptions-table">
              <thead>
                <tr>
                  <th scope="col">Shipment</th>
                  <th scope="col">Route</th>
                  <th scope="col">Carrier</th>
                  <th scope="col">Issue</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((shipment) => {
                  const pending = pendingIds.includes(shipment.id);
                  const open = shipment.status === "Open";

                  return (
                    <tr key={shipment.id}>
                      <td>
                        <a
                          href={`/shipments/${encodeURIComponent(shipment.id)}`}
                        >
                          {shipment.id}
                        </a>
                      </td>

                      <td>
                        {shipment.origin} → {shipment.destination}
                      </td>

                      <td>{shipment.carrier}</td>

                      <td>{shipment.reason}</td>

                      <td>
                        <span
                          className={`exception-priority priority-${shipment.priority.toLowerCase()}`}
                        >
                          {shipment.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`exception-status status-${shipment.status.toLowerCase()}`}
                        >
                          {shipment.status}
                        </span>
                        {pending && (
                          <span className="exception-pending">
                            Updating…
                          </span>
                        )}
                      </td>

                      <td>
                        {open ? (
                          <div className="exception-actions">
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                void updateShipment(
                                  shipment.id,
                                  "resolve"
                                )
                              }
                            >
                              Resolve
                            </button>

                            <button
                              type="button"
                              className="escalate-button"
                              disabled={pending}
                              onClick={() =>
                                void updateShipment(
                                  shipment.id,
                                  "escalate"
                                )
                              }
                            >
                              Escalate
                            </button>
                          </div>
                        ) : (
                          <span className="exception-completed">
                            Actioned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}