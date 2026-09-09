export type SavedQr = {
  id: string;
  label: string;
  payload: string;
  at: number;
};

const KEY = "pa-qr-wallet";
export const QR_WALLET_EVENT = "pa-qr-wallet";

export function loadQrs(): SavedQr[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedQr[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (q) =>
        q &&
        typeof q.id === "string" &&
        typeof q.label === "string" &&
        typeof q.payload === "string" &&
        q.payload.length > 0
    );
  } catch {
    return [];
  }
}

function persist(items: SavedQr[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(QR_WALLET_EVENT));
}

export function addQr(label: string, payload: string): SavedQr {
  const item: SavedQr = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: label.trim() || "QR",
    payload,
    at: Date.now(),
  };
  persist([item, ...loadQrs()].slice(0, 8));
  return item;
}

export function renameQr(id: string, label: string) {
  persist(
    loadQrs().map((q) =>
      q.id === id ? { ...q, label: label.trim() || q.label } : q
    )
  );
}

export function removeQr(id: string) {
  persist(loadQrs().filter((q) => q.id !== id));
}
