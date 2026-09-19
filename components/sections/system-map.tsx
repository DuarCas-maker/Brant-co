import { getServices } from "@/content/services";
import type { Locale } from "@/lib/i18n/config";

export function SystemMap({ compact = false, locale }: { compact?: boolean; locale: Locale }) {
  const services = getServices(locale);
  return (
    <div className={`relative grid gap-3 md:grid-cols-3 ${compact ? "" : "mt-12"}`}>
      <div aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-white/15 md:block">
        <span className="block h-px w-2/3 bg-[#A20000]" />
      </div>
      {services.map((service, index) => (
        <article className="relative border border-white/10 bg-[#121212] p-6 sm:p-8" id={compact ? undefined : service.id} key={service.id}>
          <div className="mb-8 flex items-center justify-between">
            <span className="grid size-16 place-items-center rounded-full border border-white/15 bg-black text-sm font-semibold text-[#D85C5C]">
              {service.number}
            </span>
            {index < services.length - 1 ? <span aria-hidden="true" className="text-xl text-[#A20000] md:hidden">↓</span> : null}
          </div>
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-[#D85C5C]">{service.stage}</p>
          <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{service.title}</h3>
          <p className="mt-4 text-sm leading-7 text-white/60">{service.definition}</p>
        </article>
      ))}
    </div>
  );
}
