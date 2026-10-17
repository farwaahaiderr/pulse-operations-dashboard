"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export default class CarrierHistoryBoundary extends React.Component<
  Props,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Carrier history failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          className="carrier-history"
          role="alert"
          aria-labelledby="carrier-history-error"
        >
          <h2 id="carrier-history-error">Carrier History</h2>

          <p>
            We couldn't load the tracking history. Your shipment details
            are still available.
          </p>

          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry History
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}