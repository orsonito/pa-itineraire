import { QT_FERRARI_URL, QT_URL, parseQueueTimes } from "@/lib/queue-times";

export const revalidate = 60;

async function fetchPark(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      Accept: "application/json",
      "User-Agent": "pa-itineraire (PortAventura planner)",
    },
  });
  if (!res.ok) throw new Error("queue-times");
  return res.json();
}

export async function GET() {
  try {
    const [pa, ferrari] = await Promise.allSettled([
      fetchPark(QT_URL),
      fetchPark(QT_FERRARI_URL),
    ]);
    const paJson = pa.status === "fulfilled" ? pa.value : null;
    const ferrariJson = ferrari.status === "fulfilled" ? ferrari.value : null;
    if (!paJson && !ferrariJson) {
      return Response.json(
        { error: "queue-times" },
        { status: 502, headers: cacheHeaders() }
      );
    }
    const data = parseQueueTimes(paJson, ferrariJson);
    return Response.json(data, { headers: cacheHeaders() });
  } catch {
    return Response.json(
      { error: "queue-times" },
      { status: 502, headers: cacheHeaders() }
    );
  }
}

function cacheHeaders() {
  return {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=180",
  };
}
