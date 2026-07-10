function Line({ className }: { className: string }) {
  return <div className={`rounded-full border border-[#dedfe3] ${className}`} />;
}

function DashedBox({ className }: { className: string }) {
  return <div className={`rounded-[28px] border border-dashed border-[#dedfe3] ${className}`} />;
}

export default function BackgroundWireframe() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[104px] z-0 hidden h-[760px] select-none overflow-hidden px-7 xl:block"
      aria-hidden="true"
    >
      <div className="relative mx-auto grid h-full max-w-[1860px] grid-cols-[365px_minmax(760px,1fr)_365px] gap-4 opacity-95">
        <div className="relative h-full rounded-[34px] border border-[#dedfe3] bg-transparent">
          <div className="absolute inset-[10px] rounded-[28px] border border-dashed border-[#dedfe3]" />
          <div className="absolute left-1/2 top-[28px] h-[126px] w-[126px] -translate-x-1/2 rounded-full border border-[#dedfe3]" />
          <Line className="absolute left-[28px] right-[28px] top-[168px] h-[32px]" />
          <Line className="absolute left-[74px] right-[74px] top-[212px] h-[32px]" />
          <DashedBox className="absolute left-[28px] right-[28px] top-[278px] h-[236px]" />
          <Line className="absolute bottom-[112px] left-[28px] h-[32px] w-[156px]" />
          <Line className="absolute bottom-[112px] left-[194px] h-[32px] w-[68px]" />
          <Line className="absolute bottom-[112px] right-[28px] h-[32px] w-[66px]" />
          <Line className="absolute bottom-[70px] left-[28px] h-[32px] w-[84px]" />
          <Line className="absolute bottom-[70px] left-[124px] right-[28px] h-[32px]" />
          <Line className="absolute bottom-[28px] left-[28px] right-[28px] h-[32px]" />
        </div>

        <div className="relative h-full rounded-[34px] border border-[#dedfe3] bg-transparent">
          <div className="absolute inset-[10px] rounded-[28px] border border-dashed border-[#dedfe3]" />
        </div>

        <div className="grid h-full grid-rows-[320px_1fr] gap-4">
          <div className="relative rounded-[34px] border border-[#dedfe3]">
            <div className="absolute inset-[10px] rounded-[28px] border border-dashed border-[#dedfe3]" />
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="absolute left-[28px] h-[42px] w-[42px] rounded-full border border-[#dedfe3]"
                style={{ top: 48 + index * 60 }}
              />
            ))}
            <Line className="absolute left-[88px] right-[28px] top-[48px] h-[42px]" />
            <DashedBox className="absolute left-[88px] right-[28px] top-[108px] h-[42px] rounded-[24px]" />
            <DashedBox className="absolute left-[88px] right-[28px] top-[168px] h-[42px] rounded-[24px]" />
            <DashedBox className="absolute left-[88px] right-[28px] top-[228px] h-[42px] rounded-[24px]" />
          </div>

          <div className="relative rounded-[34px] border border-[#dedfe3]">
            <div className="absolute inset-[10px] rounded-[28px] border border-dashed border-[#dedfe3]" />
            <Line className="absolute left-[28px] right-[28px] top-[28px] h-[220px] rounded-[28px]" />
            <Line className="absolute bottom-[124px] left-[28px] h-[82px] w-[148px] rounded-[28px]" />
            <Line className="absolute bottom-[124px] right-[28px] h-[82px] w-[148px] rounded-[28px]" />
            <Line className="absolute bottom-[28px] left-[28px] h-[82px] w-[148px] rounded-[28px]" />
            <Line className="absolute bottom-[28px] right-[28px] h-[82px] w-[148px] rounded-[28px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
