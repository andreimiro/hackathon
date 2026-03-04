import { NextResponse } from "next/server";

const HACKATHON_START = new Date("2026-03-05T19:00:00Z");
const HACKATHON_END = new Date("2026-03-06T19:00:00Z");

export async function GET() {
  const now = new Date();
  
  let status = "not-started";
  if (now >= HACKATHON_START && now < HACKATHON_END) {
    status = "in-progress";
  } else if (now >= HACKATHON_END) {
    status = "ended";
  }
  
  const targetTime = status === "not-started" ? HACKATHON_START : HACKATHON_END;
  const diff = targetTime.getTime() - now.getTime();
  
  let timeLeft = { hours: 0, minutes: 0, seconds: 0 };
  if (diff > 0) {
    timeLeft = {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }
  
  return NextResponse.json({
    status,
    timeLeft,
    hackathonStart: HACKATHON_START.toISOString(),
    hackathonEnd: HACKATHON_END.toISOString(),
  });
}
