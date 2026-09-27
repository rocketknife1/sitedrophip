import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";

export function AnnouncementBar() {
  return (
    <div className="bg-forest-deep px-4 py-2 text-center text-[13px] font-medium text-white">
      {site.demoMode && <span className="mr-2 rounded bg-note px-1.5 py-0.5 text-xs font-bold text-ink md:hidden">Demo</span>}
      Free EU delivery over {formatPrice(site.shipping.freeOverCents)}
      <span className="mx-2 hidden text-white/40 sm:inline">|</span>
      <span className="hidden sm:inline">{site.returns.withdrawalDays}-day returns, no questions asked</span>
    </div>
  );
}
