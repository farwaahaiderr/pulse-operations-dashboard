import { NextResponse } from "next/server";

type Shipment = {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: string;
  eta: string;
};

const carriers = ["BlueDart", "Delhivery", "DHL", "FedEx"];

const cities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Lucknow",
  "Jaipur",
];

const statuses = ["In Transit", "Delivered", "Delayed", "Exception"];

const shipments: Shipment[] = Array.from(
  { length: 1284 },
  (_, index) => {
    const originIndex = index % cities.length;
    const destinationIndex = (index + 3) % cities.length;

    return {
      id: `SHP-${String(1024 + index).padStart(4, "0")}`,
      origin: cities[originIndex],
      destination: cities[destinationIndex],
      carrier: carriers[Math.floor(index / 5) % carriers.length],
      status: statuses[Math.floor(index / 7) % statuses.length],
      eta: `${18 + (Math.floor(index / 3) % 10)} Oct, ${String(
        10 + (index % 8)
      ).padStart(2, "0")}:30 AM`,
    };
  }
);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseShipmentDate(eta: string) {
  const match = eta.match(/^(\d{1,2}) ([A-Za-z]{3}),/);

  if (!match) {
    return null;
  }

  const date = new Date(`${match[1]} ${match[2]} 2026`);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: Request) {
  await delay(150 + Math.floor(Math.random() * 1351));

  // Simulate a 3% read failure.
  if (Math.random() < 0.03) {
    return NextResponse.json(
      { error: "Unable to load shipments. Please try again." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const limitParam = Number(searchParams.get("limit") ?? 20);
  const cursor = searchParams.get("cursor");

  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const status = searchParams.get("status") ?? "all";
  const region = searchParams.get("region") ?? "all";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "id";
  const sortDirection = searchParams.get("sortDirection") ?? "asc";

  const allowedSortColumns = [
    "id",
    "origin",
    "destination",
    "carrier",
    "status",
    "eta",
  ] as const;

  type SortColumn = (typeof allowedSortColumns)[number];

  const safeSortBy: SortColumn = allowedSortColumns.includes(
    sortBy as SortColumn
  )
    ? (sortBy as SortColumn)
    : "id";

  const safeSortDirection =
    sortDirection === "desc" ? "desc" : "asc";

  const limit = Number.isFinite(limitParam)
    ? Math.min(100, Math.max(1, Math.floor(limitParam)))
    : 20;

  const startIndex =
    cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;

  const filtered = shipments.filter((shipment) => {
    const matchesSearch = [
      shipment.id,
      shipment.origin,
      shipment.destination,
      shipment.carrier,
      shipment.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);

    const matchesStatus =
      status === "all" || shipment.status === status;

    const matchesRegion =
      region === "all" ||
      shipment.origin === region ||
      shipment.destination === region;

    const shipmentDate = parseShipmentDate(shipment.eta);

    const matchesStartDate =
      !startDate ||
      (shipmentDate !== null &&
        shipmentDate >= new Date(`${startDate}T00:00:00`));

    const matchesEndDate =
      !endDate ||
      (shipmentDate !== null &&
        shipmentDate <= new Date(`${endDate}T23:59:59`));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRegion &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  filtered.sort((a, b) => {
    const comparison = a[safeSortBy].localeCompare(b[safeSortBy]);

    return safeSortDirection === "asc" ? comparison : -comparison;
  });

  const page = filtered.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + page.length;
  const hasMore = nextIndex < filtered.length;

  return NextResponse.json({
    data: page,
    pagination: {
      limit,
      nextCursor: hasMore ? String(nextIndex) : null,
      hasMore,
      total: filtered.length,
    },
  });
}