"use client";

type CarrierHistoryErrorProps = {
  error: Error;
  reset: () => void;
};

export default function CarrierHistoryError({
  reset,
}: CarrierHistoryErrorProps) {
  return (
    <section
      className="carrier-history"
      role="alert"
      aria-labelledby="history-error-heading"
    >
      <h2 id="history-error-heading">Carrier History</h2>

      <p>
        We couldn't load the tracking history, but your shipment details
        are still available.
      </p>

      <button type="button" onClick={reset}>
        Retry History
      </button>
    </section>
  );
}