# Pulse Operations Dashboard

A responsive shipment operations dashboard built with Next.js, React, TypeScript, and custom CSS. It provides shipment monitoring, carrier information, operational analytics, and exception management through a clean interface.

## Features

### 1. Overview Dashboard
- Summary cards for shipment operations.
- Shipment table with pagination.
- Search by shipment and carrier information.
- Filter by status, region, and date range.
- Sortable shipment columns.
- URL query parameters for shipment searches and filters.

### 2. Shipment Details
- Individual shipment information.
- Carrier history with loading and error states.
- Retry support when carrier history fails to load.

### 3. Exception Queue
- View shipments requiring attention.
- Resolve or escalate open exceptions.
- Optimistic UI updates.
- Rollback when an update fails.
- Conflict handling for exceptions that have already been updated.

### 4. Carrier Management
- Carrier overview and comparison.
- Links to view shipments associated with a carrier.

### 5. Analytics
- Shipment totals and status breakdowns calculated from shipment data.
- Carrier-level delivered shipment percentages.
- Clearly labelled illustrative data for the weekly demo chart.

### 6. Reliability and Accessibility
- Loading, empty, and error states.
- Retry actions where appropriate.
- Responsive layouts for smaller screens.
- Semantic page structure and accessible interaction patterns.
- API request delays and simulated failures for testing.

## Tech Stack

- Next.js App Router
- React
- TypeScript with strict type checking
- CSS
- Next.js Route Handlers
- In-memory mock data

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

Clone the repository and open its directory:

```bash
git clone <YOUR_PUBLIC_REPOSITORY_URL>
cd pulse-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

Check the production build:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Overview dashboard and shipments table |
| `/shipments/[id]` | Individual shipment details and carrier history |
| `/exceptions` | Exception queue and resolution actions |
| `/carriers` | Carrier overview |
| `/analytics` | Shipment and carrier analytics |

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/shipments` | GET | List, search, filter, sort, and paginate shipments |
| `/api/shipments/[id]/history` | GET | Retrieve mock carrier history |
| `/api/exceptions` | GET | Retrieve exception records |
| `/api/exceptions/[id]` | PATCH | Resolve or escalate an exception |

The mock shipment dataset contains more than 1,000 records. The shipments endpoint supports cursor-style pagination and server-side filtering and sorting.

API handlers introduce artificial latency and randomized failures to exercise loading and error handling. Write operations can return simulated failures, and conflicting exception updates can return HTTP 409.

## Architecture and Rendering Strategy

- **Server Components:** Used for page-level rendering where server-side data loading is appropriate.
- **Client Components:** Used for interactive tables, filters, sorting, pagination, exception actions, and client-side loading and error states.
- **Route Handlers:** Provide API endpoints backed by mock in-memory data.
- **Suspense and loading UI:** Used to provide feedback while secondary shipment information is loading.
- **Caching:** Dynamic operational data is fetched without caching where freshness is important.
- **Optimistic updates:** Exception actions update the interface immediately and restore the previous state if the API request fails.

## Data and Limitations

This is a demonstration application using mock in-memory data. It is not connected to a production logistics provider or persistent database.

- Shipment and carrier information is illustrative.
- Mock data changes are not guaranteed to survive a server restart.
- Randomized API failures are intentional and help demonstrate resilient UI behaviour.
- The weekly analytics chart is illustrative demo data, not a historical production report.
- Carrier delivered percentages represent the share of a carrier's shipments currently marked as delivered; they do not establish on-time delivery performance.

## Future Improvements

- Integrate a persistent database and real carrier APIs.
- Add authentication and role-based permissions.
- Add automated unit, integration, and end-to-end tests.
- Improve real-time shipment tracking with server-sent events or WebSockets.
- Add historical analytics based on timestamped shipment events.
- Deploy the application and add monitoring and structured logging.

## Demo Video

[Watch Pulse Operations Dashboard Demo](https://www.loom.com/share/4fde5471c08247a6bba431b48f9c80bc)

The walkthrough should cover the overview, shipment filters and pagination, shipment details, carrier history, exception resolution, analytics, and responsive layout.

## Author

Developed as a frontend dashboard project demonstrating Next.js, TypeScript, API integration, responsive UI design, and resilient interaction patterns.