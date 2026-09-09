import { AppShell } from "@/components/app/AppShell";
import { parseDay, parseDone, parseTab } from "@/lib/nav";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string | string[];
    day?: string | string[];
    done?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  return (
    <AppShell
      tab={parseTab(sp.tab)}
      day={parseDay(sp.day)}
      allDone={parseDone(sp.done)}
    />
  );
}
