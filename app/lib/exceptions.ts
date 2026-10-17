export type ExceptionStatus = "Open" | "Resolved" | "Escalated";

export type ExceptionShipment = {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ExceptionStatus;
  reason: string;
  priority: "High" | "Medium" | "Low";
};

export const exceptions: ExceptionShipment[] = [
  {
    id: "SHP-1027",
    origin: "Mumbai",
    destination: "Delhi",
    carrier: "BlueDart",
    status: "Open",
    reason: "Delivery delayed beyond expected date",
    priority: "High",
  },
  {
    id: "SHP-1034",
    origin: "Bengaluru",
    destination: "Pune",
    carrier: "Delhivery",
    status: "Open",
    reason: "Shipment has not moved for 48 hours",
    priority: "High",
  },
  {
    id: "SHP-1042",
    origin: "Hyderabad",
    destination: "Chennai",
    carrier: "DHL",
    status: "Open",
    reason: "Address verification required",
    priority: "Medium",
  },
  {
    id: "SHP-1051",
    origin: "Lucknow",
    destination: "Jaipur",
    carrier: "FedEx",
    status: "Open",
    reason: "Delivery attempt failed",
    priority: "Medium",
  },
  {
    id: "SHP-1063",
    origin: "Delhi",
    destination: "Mumbai",
    carrier: "BlueDart",
    status: "Open",
    reason: "Package reported damaged",
    priority: "High",
  },
];