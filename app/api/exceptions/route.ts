import { NextResponse } from "next/server";
import { exceptions } from "../../lib/exceptions";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await delay(150 + Math.floor(Math.random() * 1351));

  // Simulate a 3% read failure.
  if (Math.random() < 0.03) {
    return NextResponse.json(
      { error: "Unable to load exceptions. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: exceptions,
  });
}