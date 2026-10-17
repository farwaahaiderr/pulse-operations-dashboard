import { NextResponse } from "next/server";
import { exceptions } from "../../../lib/exceptions";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await delay(150 + Math.floor(Math.random() * 1351));

  // Simulate an 8% write failure.
  if (Math.random() < 0.08) {
    return NextResponse.json(
      { error: "The action failed. Please try again." },
      { status: 500 }
    );
  }

  const { id } = await context.params;

  let body: { action?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const shipment = exceptions.find((item) => item.id === id);

  if (!shipment) {
    return NextResponse.json(
      { error: "Exception shipment not found." },
      { status: 404 }
    );
  }

  if (shipment.status !== "Open") {
    return NextResponse.json(
      { error: "This exception has already been actioned." },
      { status: 409 }
    );
  }

  if (body.action === "resolve") {
    shipment.status = "Resolved";
  } else if (body.action === "escalate") {
    shipment.status = "Escalated";
  } else {
    return NextResponse.json(
      { error: "Invalid action." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: shipment,
  });
}