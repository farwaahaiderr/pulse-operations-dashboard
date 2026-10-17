import { NextResponse } from "next/server";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Simulate a slow external carrier service.
  await delay(1200);

  // Simulate a 3% read failure.
  if (Math.random() < 0.03) {
    return NextResponse.json(
      { error: "Carrier history is temporarily unavailable." },
      { status: 500 }
    );
  }

  const { id } = await context.params;

  const history = [
    {
      id: 1,
      status: "Shipment Created",
      location: "Origin Facility",
      timestamp: "18 Oct, 08:00 AM",
      description: "Shipment information was received.",
    },
    {
      id: 2,
      status: "Picked Up",
      location: "Mumbai Distribution Center",
      timestamp: "18 Oct, 09:15 AM",
      description: "The carrier collected the shipment.",
    },
    {
      id: 3,
      status: "In Transit",
      location: "Regional Sorting Hub",
      timestamp: "18 Oct, 11:30 AM",
      description: "Shipment is moving through the carrier network.",
    },
    {
      id: 4,
      status: "Out for Delivery",
      location: "Destination Facility",
      timestamp: "19 Oct, 09:00 AM",
      description: "Shipment is being prepared for final delivery.",
    },
  ];

  return NextResponse.json({
    shipmentId: id,
    history,
  });
}