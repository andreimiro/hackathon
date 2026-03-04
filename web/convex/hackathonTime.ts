import { query } from "./_generated/server";

export const getHackathonTime = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    
    // Server-side hackathon times (UTC)
    const hackathonStart = new Date("2026-03-05T19:00:00Z");
    const hackathonEnd = new Date("2026-03-06T19:00:00Z");
    
    // Determine status based on server time
    let status: "not-started" | "in-progress" | "ended";
    if (now < hackathonStart) {
      status = "not-started";
    } else if (now < hackathonEnd) {
      status = "in-progress";
    } else {
      status = "ended";
    }
    
    // Calculate time remaining
    const targetTime = status === "not-started" ? hackathonStart : hackathonEnd;
    const diff = targetTime.getTime() - now.getTime();
    
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    if (diff > 0) {
      timeLeft = {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
    
    return {
      now: now.toISOString(),
      hackathonStart: hackathonStart.toISOString(),
      hackathonEnd: hackathonEnd.toISOString(),
      status,
      timeLeft,
    };
  },
});
