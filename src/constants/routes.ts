import { EMPTY_DONE, href, type TabId } from "@/lib/nav";
import type { DayId } from "@/data/wait-model";

export const ROUTES = {
  home: "/",
  ruta: href("ruta", "sun", EMPTY_DONE),
  ici: href("colas", "sun", EMPTY_DONE),
  colas: href("colas", "sun", EMPTY_DONE),
  dias: href("ruta", "sun", EMPTY_DONE),
  ferrari: href("colas", "sun", EMPTY_DONE),
  mas: href("mas", "sun", EMPTY_DONE),
} as const;

export const TABS: { id: TabId; href: string }[] = [
  { id: "ruta", href: ROUTES.ruta },
  { id: "colas", href: ROUTES.colas },
  { id: "mas", href: ROUTES.mas },
];

export function tabRoute(tab: TabId, day: DayId = "sun") {
  return href(tab, day, EMPTY_DONE);
}
