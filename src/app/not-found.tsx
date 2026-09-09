export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-[#f4efe6] px-6 text-center text-zinc-800">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
        PortAventura
      </p>
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <a href="/" className="mt-2 text-[15px] font-semibold text-teal-800 underline">
        Volver al plan
      </a>
    </div>
  );
}
