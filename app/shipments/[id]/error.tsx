"use client";

import { useEffect } from "react";

export default function ShipmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shipment page error:", error);
  }, [error]);

  return (
    <main
      className="shipment-detail-page"
      role="alert"
      aria-labelledby="error-heading"
    >
      <h1 id="error-heading">Something went wrong</h1>

      <p>
        We couldn't load your shipment information or carrier history.
        Please try again.
      </p>

      <button type="button" onClick={reset}>
        Try Again
      </button>

      <p>
        If the problem continues, return to the dashboard and try again later.
      </p>

      <a href="/">← Back to dashboard</a>
    </main>
  );
}