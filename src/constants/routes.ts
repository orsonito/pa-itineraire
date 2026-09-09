import { EMPTY_DONE, href, type TabId } from "@/lib/nav";
import type { DayId } from "@/data/wait-model";

export const ROUTES = {
  home: "/",
  ahora: href("ahora", "sun", EMPTY_DONE),
  ruta: href("ruta", "sun", EMPTY_DONE),
  colas: href("colas", "sun", EMPTY_DONE),
  dias: href("dias", "sun", EMPTY_DONE),
  ferrari: href("ferrari", "sun", EMPTY_DONE),
  mas: href("mas", "sun", EMPTY_DONE),
} as const;

export const TABS: { id: TabId; href: string }[] = [
  { id: "ahora", href: ROUTES.ahora },
  { id: "ruta", href: ROUTES.ruta },
  { id: "colas", href: ROUTES.colas },
  { id: "dias", href: ROUTES.dias },
  { id: "ferrari", href: ROUTES.ferrari },
  { id: "mas", href: ROUTES.mas },
];

export function tabRoute(tab: TabId, day: DayId = "sun") {
  return href(tab, day, EMPTY_DONE);
}
