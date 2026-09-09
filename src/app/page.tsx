import { AppShell } from "@/components/app/AppShell";
import { madridNowLabel, parseClock } from "@/lib/clock";
import { parseDay, parseDone, parseTab } from "@/lib/nav";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string | string[];
    day?: string | string[];
    done?: string | string[];
    at?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const pinned = parseClock(sp.at);
  return (
    <AppShell
      tab={parseTab(sp.tab)}
      day={parseDay(sp.day)}
      allDone={parseDone(sp.done)}
      at={pinned}
      clock={pinned ?? madridNowLabel()}
    />
  );
}
