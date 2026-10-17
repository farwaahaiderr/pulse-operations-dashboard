"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

type Shipment = {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: string;
  eta: string;
};

const shipments: Shipment[] = [
  {
    id: "SHP-1024",
    origin: "Mumbai",
    destination: "Delhi",
    carrier: "BlueDart",
    status: "In Transit",
    eta: "18 Oct, 10:30 AM",
  },
  {
    id: "SHP-1025",
    origin: "Bengaluru",
    destination: "Hyderabad",
    carrier: "Delhivery",
    status: "Delivered",
    eta: "17 Oct, 08:15 AM",
  },
  {
    id: "SHP-1026",
    origin: "Pune",
    destination: "Chennai",
    carrier: "DHL",
    status: "Delayed",
    eta: "19 Oct, 02:00 PM",
  },
  {
    id: "SHP-1027",
    origin: "Delhi",
    destination: "Jaipur",
    carrier: "BlueDart",
    status: "In Transit",
    eta: "18 Oct, 04:45 PM",
  },
  {
    id: "SHP-1028",
    origin: "Lucknow",
    destination: "Mumbai",
    carrier: "FedEx",
    status: "Exception",
    eta: "Awaiting update",
  },
];

const statusStyles: Record<string, string> = {
  "In Transit": "transit",
  Delivered: "delivered",
  Delayed: "delayed",
  Exception: "exception",
};

export default function ShipmentsTable() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
 const [search, setSearch] = React.useState(
  searchParams.get("search") ??
    searchParams.get("carrier") ??
    ""
);

const [statusFilter, setStatusFilter] = React.useState(
  searchParams.get("status") ?? "all"
);

const [regionFilter, setRegionFilter] = React.useState(
  searchParams.get("region") ?? "all"
);

const [startDate, setStartDate] = React.useState(
  searchParams.get("startDate") ?? ""
);

const [endDate, setEndDate] = React.useState(
  searchParams.get("endDate") ?? ""
);

  const [sortBy, setSortBy] = React.useState<keyof Shipment>("id");
  const [apiShipments, setApiShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([
  null,
]);

  const updateURL = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams.toString());

  if (value === "" || value === "all") {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  params.delete("page");

  const queryString = params.toString();

  router.replace(queryString ? `?${queryString}` : window.location.pathname);
};
  const [sortDirection, setSortDirection] =
    React.useState<"asc" | "desc">("asc");
    React.useEffect(() => {
  let cancelled = false;

  async function loadShipments() {
    try {
      setLoading(true);
      setError("");

       const cursor = cursorHistory[page - 1];

const params = new URLSearchParams();

params.set("limit", "20");

if (cursor !== null && cursor !== undefined) {
  params.set("cursor", cursor);
}

params.set("search", search);
params.set("status", statusFilter);
params.set("region", regionFilter);
params.set("startDate", startDate);
params.set("endDate", endDate);
params.set("sortBy", sortBy);
params.set("sortDirection", sortDirection);

const url = `/api/shipments?${params.toString()}`;

const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to load shipments. Please try again.");
      }

     const result: {
      data: Shipment[];
      pagination: {
      nextCursor: string | null;
      hasMore: boolean;
      total: number;
      };
     } = await response.json();

      if (!cancelled) {
        setApiShipments(result.data);
        setNextCursor(result.pagination.nextCursor);
      setHasMore(result.pagination.hasMore);
      }
     } catch {
      if (!cancelled) {
        setError("Unable to load shipments. Please try again.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadShipments();

  return () => {
    cancelled = true;
  };
}, [
  page,
  cursorHistory,
  search,
  statusFilter,
  regionFilter,
  startDate,
  endDate,
  sortBy,
  sortDirection,
]);

  // Step 1: Filter shipments by search and status.
  

  // Step 2: Sort the filtered shipments.
  

  // Step 3: Change the sorting column or direction.
  const handleSort = (column: keyof Shipment) => {
    if (sortBy === column) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
 


const goToNextPage = () => {
  if (!hasMore || nextCursor === null || loading) return;

  setCursorHistory((history) => [...history, nextCursor]);
  setPage((currentPage) => currentPage + 1);
};

const goToPreviousPage = () => {
  if (page <= 1 || loading) return;

  setPage((currentPage) => currentPage - 1);
};

  // Reusable heading button.
  const sortButton = (column: keyof Shipment, label: string) => (
    <button
      type="button"
      onClick={() => handleSort(column)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {sortBy === column &&
        (sortDirection === "asc" ? " ↑" : " ↓")}
    </button>
  );

  return (
    <section className="shipments-section" id="shipments">
      <div className="section-heading">
        <div>
          <h2>Recent shipments</h2>
          <p>Monitor and manage your latest shipment activity.</p>
        </div>

        <button className="secondary-button" type="button">
          View all shipments →
        </button>
      </div>

      <div className="table-toolbar">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search shipment ID, carrier..."
            aria-label="Search shipments"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="toolbar-filters">
           <select
  aria-label="Filter by city"
  value={regionFilter}
  onChange={(event) => {
    const value = event.target.value;
    setRegionFilter(value);
    updateURL("region", value);
    setPage(1);
    setCursorHistory([null]);
  }}
>
  <option value="all">All cities</option>
  <option value="Mumbai">Mumbai</option>
  <option value="Delhi">Delhi</option>
  <option value="Bengaluru">Bengaluru</option>
  <option value="Hyderabad">Hyderabad</option>
  <option value="Pune">Pune</option>
  <option value="Chennai">Chennai</option>
  <option value="Lucknow">Lucknow</option>
  <option value="Jaipur">Jaipur</option>
</select>
          <select
  aria-label="Filter by status"
  value={statusFilter}
  onChange={(event) => {
    const value = event.target.value;
    setStatusFilter(value);
    updateURL("status", value);
    setPage(1);
    setCursorHistory([null]);
  }}
>
            <option value="all">All statuses</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
            <option value="Exception">Exception</option>
          </select>
           
           <label className="date-filter">
  <span>From</span>
  <input
  type="date"
  aria-label="Start date"
  value={startDate}
  onChange={(event) => {
    const value = event.target.value;
    setStartDate(value);
    updateURL("startDate", value);
    setPage(1);
    setCursorHistory([null]);
  }}
/>
</label>

<label className="date-filter">
  <span>To</span>
 <input
  type="date"
  aria-label="End date"
  value={endDate}
  min={startDate || undefined}
  onChange={(event) => {
    const value = event.target.value;
    setEndDate(value);
    updateURL("endDate", value);
    setPage(1);
    setCursorHistory([null]);
  }}
/>
</label>

          <button className="filter-button" type="button">
            ⚙ Filters
          </button>
        </div>
      </div>
       {loading && <p role="status">Loading shipments...</p>}

{error && (
  <div role="alert">
    <p>{error}</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
    >
      Try again
    </button>
  </div>
)}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{sortButton("id", "SHIPMENT ID")}</th>
              <th>{sortButton("origin", "ROUTE")}</th>
              <th>{sortButton("carrier", "CARRIER")}</th>
              <th>{sortButton("status", "STATUS")}</th>
              <th>{sortButton("eta", "EST. DELIVERY")}</th>
              <th aria-label="Actions"></th>
            </tr>
          </thead>

          <tbody>
            {apiShipments.map((shipment) => (
              <tr key={shipment.id}>
             <td>
  <a
    className="shipment-id"
    href={`/shipments/${shipment.id}`}
    aria-label={`View details for shipment ${shipment.id}`}
  >
    {shipment.id}
  </a>
</td>
                <td>
                  <div className="route">
                    <strong>{shipment.origin}</strong>
                    <span aria-hidden="true">→</span>
                    <strong>{shipment.destination}</strong>
                  </div>
                </td>

                <td>
                  <span className="carrier">{shipment.carrier}</span>
                </td>

                <td>
                  <span
                    className={`status-badge ${statusStyles[shipment.status]}`}
                  >
                    <span className="status-dot"></span>
                    {shipment.status}
                  </span>
                </td>

                <td className="eta">{shipment.eta}</td>

                <td>
                  <button
                    className="row-menu"
                    aria-label={`More actions for ${shipment.id}`}
                    type="button"
                  >
                    ···
                  </button>
                </td>
              </tr>
            ))}

            {apiShipments.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">
                  No shipments match your search or selected status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    <div className="table-footer">
  <span>
    Page {page} · Showing {apiShipments.length} shipments
  </span>

  <div className="pagination">
    <button
      type="button"
      onClick={goToPreviousPage}
      disabled={page === 1 || loading}
      aria-label="Previous page"
    >
      ← Previous
    </button>

    <span>Page {page}</span>

    <button
      type="button"
      onClick={goToNextPage}
      disabled={!hasMore || loading}
      aria-label="Next page"
    >
      Next →
    </button>
  </div>
</div>
    </section>
  );
}