const EXCHANGES = [
  { name: "Binance", src: "/exchanges/binance-full.svg" },
  { name: "Coinbase", src: "/exchanges/coinbase-full.svg" },
  { name: "OKX", src: "/exchanges/okx-full.svg" },
  { name: "Kraken", src: "/exchanges/kraken-full.svg" },
];

function ExchangeLogo({ exchange }: { exchange: (typeof EXCHANGES)[number] }) {
  return (
    <div className="mx-6 flex items-center sm:mx-12">
      <img
        alt={exchange.name}
        className="h-6 w-auto object-contain grayscale transition-[filter] duration-300 hover:grayscale-0 sm:h-8"
        draggable={false}
        src={exchange.src}
      />
    </div>
  );
}

export default function ExchangeCarousel() {
  const loop = [...EXCHANGES, ...EXCHANGES];

  return (
    <div className="relative my-12 w-full max-w-[930px] overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#f4f4f6] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f4f4f6] to-transparent" />
      <div className="flex w-max animate-exchange-marquee items-center">
        {loop.map((exchange, index) => (
          <ExchangeLogo exchange={exchange} key={`${exchange.name}-${index}`} />
        ))}
      </div>
    </div>
  );
}
