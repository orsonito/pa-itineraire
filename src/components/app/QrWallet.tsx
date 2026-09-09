"use client";

import { addQr, loadQrs, removeQr, renameQr, QR_WALLET_EVENT, type SavedQr } from "@/lib/qr-wallet";
import { decodeQrFromFile, qrDataUrl } from "@/lib/qr-codec";
import { href } from "@/lib/nav";
import { Camera, ImageUp, QrCode, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";

export function useQrWallet() {
  const [items, setItems] = useState<SavedQr[]>([]);
  useEffect(() => {
    const sync = () => setItems(loadQrs());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(QR_WALLET_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(QR_WALLET_EVENT, sync);
    };
  }, []);
  return items;
}

export function QrWallet() {
  const items = useQrWallet();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const payload = await decodeQrFromFile(file);
      if (!payload) {
        setError("Aucun QR lu. Recadre plus près, avec plus de lumière, et réessaie.");
        return;
      }
      const n = loadQrs().length + 1;
      const item = addQr(`QR ${n}`, payload);
      setOpenId(item.id);
    } catch {
      setError("Impossible de lire cette image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
      <h2 className="flex items-center gap-2 font-bold">
        <QrCode className="size-4" />
        Ton QR
      </h2>
      <p className="mt-1 text-[12px] text-zinc-500">
        Photo ou image d’un billet, Express ou hôtel. Il reste sur ce téléphone,
        rien n’est envoyé.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => cameraRef.current?.click()}
          className="flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-xl bg-teal-800 text-[13px] font-bold text-white disabled:opacity-60"
        >
          <Camera className="size-4" />
          Photo
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => galleryRef.current?.click()}
          className="flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-teal-900 ring-1 ring-zinc-200 disabled:opacity-60"
        >
          <ImageUp className="size-4" />
          Galerie
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {busy && (
        <p className="mt-3 text-[13px] font-semibold text-teal-800">
          Lecture du QR…
        </p>
      )}
      {error && (
        <p className="mt-3 text-[13px] font-semibold text-red-700">{error}</p>
      )}

      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((q) => (
            <QrRow key={q.id} item={q} onShow={() => setOpenId(q.id)} />
          ))}
        </ul>
      )}

      {openId && (
        <QrFullscreen
          item={items.find((q) => q.id === openId) ?? null}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}

function QrRow({ item, onShow }: { item: SavedQr; onShow: () => void }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void qrDataUrl(item.payload).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [item.payload]);

  return (
    <li className="flex items-center gap-2 rounded-xl bg-[#f4efe6] p-2">
      <button
        type="button"
        onClick={onShow}
        className="size-14 shrink-0 overflow-hidden rounded-lg bg-white p-1 touch-manipulation"
        aria-label="Afficher en plein écran"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-contain" />
        ) : (
          <div className="size-full bg-zinc-100" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <input
          value={item.label}
          onChange={(e) => renameQr(item.id, e.target.value)}
          className="w-full bg-transparent text-[14px] font-bold outline-none"
          aria-label="Nom du QR"
        />
        <button
          type="button"
          onClick={onShow}
          className="text-[11px] font-semibold text-teal-800 touch-manipulation"
        >
          Plein écran
        </button>
      </div>
      <button
        type="button"
        onClick={() => removeQr(item.id)}
        className="flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-lg text-zinc-500"
        aria-label="Supprimer"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

export function QrHeaderButton() {
  const items = useQrWallet();
  const { day, allDone } = useVisit();
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <NavLink
        href={href("mas", day, allDone)}
        className="flex size-9 touch-manipulation items-center justify-center rounded-full bg-white/10 text-white"
        ariaLabel="Ajouter un QR"
      >
        <QrCode className="size-4" />
      </NavLink>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenId(items[0].id)}
        className="flex size-9 touch-manipulation items-center justify-center rounded-full bg-amber-400 text-teal-950"
        aria-label="Afficher le QR"
      >
        <QrCode className="size-4" />
      </button>
      {openId && (
        <QrFullscreen
          item={items.find((q) => q.id === openId) ?? items[0]}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}

function QrFullscreen({
  item,
  onClose,
}: {
  item: SavedQr | null;
  onClose: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    let alive = true;
    void qrDataUrl(item.payload).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    let wake: { release: () => Promise<void> } | undefined;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    void nav.wakeLock
      ?.request("screen")
      .then((lock) => {
        wake = lock;
      })
      .catch(() => undefined);
    return () => {
      window.removeEventListener("keydown", onKey);
      void wake?.release();
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={item.label}
      className="fixed inset-0 z-[80] flex flex-col bg-black pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="text-[15px] font-bold">{item.label}</div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 touch-manipulation items-center justify-center rounded-full bg-white/10"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex min-h-0 flex-1 flex-col items-center justify-center px-6"
      >
        <div className="w-full max-w-sm rounded-2xl bg-white p-4">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={item.label} className="w-full" />
          ) : (
            <div className="aspect-square w-full bg-zinc-100" />
          )}
        </div>
        <p className="mt-4 text-[13px] font-semibold text-zinc-400">
          Passe ce QR au scanner · touche pour fermer
        </p>
      </button>
    </div>
  );
}
