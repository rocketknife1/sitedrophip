/** Small but always visible: this is a demo, nothing ships. Remove by setting NEXT_PUBLIC_DEMO_MODE=false. */
export function DemoBanner() {
  return (
    <div
      role="note"
      className="fixed bottom-3 left-3 z-30 hidden max-w-[calc(100vw-1.5rem)] rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white shadow-lg md:block"
    >
      Demo store: orders are not shipped
    </div>
  );
}
