import type { StatCardContent } from "@/types/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "network" && (
        <>
          <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </>
      )}
      {name === "card" && (
        <>
          <rect x="4" y="6" width="16" height="12" rx="3" fill="currentColor" />
          <path d="M8 10h8M8 14h5" stroke="white" strokeLinecap="round" strokeWidth="2" />
        </>
      )}
      {name === "shield" && (
        <path d="M12 3 19 6v5c0 4.6-2.8 7.8-7 10-4.2-2.2-7-5.4-7-10V6l7-3Z" fill="currentColor" />
      )}
      {name === "scan" && (
        <>
          <path d="M7 4H4v3M17 4h3v3M7 20H4v-3M17 20h3v-3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </>
      )}
      {name === "check" && (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" />
          <path d="m8.5 12.5 2.2 2.2 4.8-5.4" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </>
      )}
      {name === "nodes" && (
        <>
          <rect x="8" y="3" width="8" height="7" rx="1.5" fill="currentColor" />
          <rect x="3" y="16" width="6" height="5" rx="1.5" fill="currentColor" />
          <rect x="15" y="16" width="6" height="5" rx="1.5" fill="currentColor" />
          <path d="M12 10v3M6 16v-3h12v3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export default function StatsSection({ cards }: { cards: StatCardContent[] }) {
  const safeCards = Array.isArray(cards) ? cards.filter((card) => card && card.label) : [];
  if (safeCards.length === 0) return null;

  return (
    <section className="bg-[#f4f4f6] px-5 pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-[930px] grid-cols-1 gap-4 md:grid-cols-3">
        {safeCards.map((card, index) => (
          <article
            key={`${card.label}-${index}`}
            className="flex h-[220px] flex-col justify-between rounded-[10px] bg-white px-6 pb-7 pt-6 sm:h-[260px] lg:h-[312px]"
          >
            <div className="grid size-12 place-items-center rounded-[8px] bg-[#f4f4f6] text-[#171725]">
              <Icon name={card.icon} />
            </div>

            <div>
              {card.value ? (
                <div className="text-[48px] font-normal leading-[0.92] tracking-[-0.06em] text-[#11111d] sm:text-[56px] lg:text-[64px] lg:tracking-[-0.07em]">
                  {card.value}
                </div>
              ) : (
                <h2 className="whitespace-pre-line text-[26px] font-normal leading-[0.92] tracking-[-0.045em] text-[#11111d] sm:text-[28px] lg:text-[32px] lg:tracking-[-0.055em]">
                  {card.title}
                </h2>
              )}
              <p className="mt-3 text-[18px] font-normal leading-none tracking-[-0.035em] text-[#262633]">
                {card.label}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
