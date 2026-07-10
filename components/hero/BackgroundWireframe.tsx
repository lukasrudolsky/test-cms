function TraceLine({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-px bg-gradient-to-r from-transparent via-[#c9cbd3]/80 to-transparent ${className}`}
    />
  );
}

function TraceNode({ className }: { className: string }) {
  return (
    <div
      className={`absolute size-2 rounded-full border border-[#c6c8d0] bg-[#f4f4f6] shadow-[0_0_0_5px_rgba(244,244,246,0.86)] ${className}`}
    />
  );
}

function SoftPanel({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-[28px] border border-[#dfe0e6]/80 bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${className}`}
    />
  );
}

export default function BackgroundWireframe() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[104px] z-0 hidden h-[760px] select-none overflow-hidden px-7 xl:block"
      aria-hidden="true"
    >
      <div className="relative mx-auto h-full max-w-[1860px] opacity-80">
        <div className="absolute inset-x-[390px] top-0 h-full rounded-[34px] border border-[#dedfe3]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
        <div className="absolute inset-x-[400px] top-[10px] h-[calc(100%-20px)] rounded-[28px] border border-[#ececf1]" />

        <div className="absolute inset-x-[420px] top-[88px] h-px bg-gradient-to-r from-transparent via-[#d4d5dc] to-transparent" />
        <div className="absolute inset-x-[460px] bottom-[88px] h-px bg-gradient-to-r from-transparent via-[#d4d5dc] to-transparent" />

        <TraceLine className="left-[98px] top-[182px] w-[310px]" />
        <TraceLine className="left-[160px] top-[332px] w-[220px]" />
        <TraceLine className="left-[92px] bottom-[150px] w-[300px]" />
        <TraceLine className="right-[104px] top-[204px] w-[300px]" />
        <TraceLine className="right-[148px] top-[386px] w-[230px]" />
        <TraceLine className="right-[82px] bottom-[176px] w-[310px]" />

        <div className="absolute left-[70px] top-[112px] h-[540px] w-[300px] rounded-[30px] border border-[#e0e1e7]/70 bg-white/[0.08]" />
        <div className="absolute right-[70px] top-[118px] h-[520px] w-[300px] rounded-[30px] border border-[#e0e1e7]/70 bg-white/[0.08]" />

        <SoftPanel className="left-[110px] top-[154px] h-[78px] w-[160px]" />
        <SoftPanel className="left-[128px] top-[274px] h-[118px] w-[205px]" />
        <SoftPanel className="left-[96px] bottom-[120px] h-[74px] w-[230px]" />

        <SoftPanel className="right-[106px] top-[156px] h-[92px] w-[220px]" />
        <SoftPanel className="right-[148px] top-[316px] h-[126px] w-[170px]" />
        <SoftPanel className="right-[92px] bottom-[118px] h-[78px] w-[238px]" />

        <div className="absolute left-[202px] top-[180px] h-[1px] w-[170px] rotate-[26deg] bg-gradient-to-r from-[#d6d7de] to-transparent" />
        <div className="absolute left-[234px] bottom-[206px] h-[1px] w-[150px] -rotate-[18deg] bg-gradient-to-r from-[#d6d7de] to-transparent" />
        <div className="absolute right-[228px] top-[250px] h-[1px] w-[160px] -rotate-[22deg] bg-gradient-to-l from-[#d6d7de] to-transparent" />
        <div className="absolute right-[240px] bottom-[212px] h-[1px] w-[160px] rotate-[20deg] bg-gradient-to-l from-[#d6d7de] to-transparent" />

        <TraceNode className="left-[96px] top-[178px]" />
        <TraceNode className="left-[366px] top-[178px]" />
        <TraceNode className="left-[156px] top-[328px]" />
        <TraceNode className="left-[374px] top-[328px]" />
        <TraceNode className="left-[90px] bottom-[146px]" />
        <TraceNode className="left-[386px] bottom-[146px]" />
        <TraceNode className="right-[96px] top-[200px]" />
        <TraceNode className="right-[398px] top-[200px]" />
        <TraceNode className="right-[144px] top-[382px]" />
        <TraceNode className="right-[382px] top-[382px]" />
        <TraceNode className="right-[78px] bottom-[172px]" />
        <TraceNode className="right-[392px] bottom-[172px]" />

        <div className="absolute left-[402px] top-[52px] h-[656px] w-px bg-gradient-to-b from-transparent via-[#e1e2e8] to-transparent" />
        <div className="absolute right-[402px] top-[52px] h-[656px] w-px bg-gradient-to-b from-transparent via-[#e1e2e8] to-transparent" />
        <div className="absolute left-[410px] right-[410px] top-[10px] h-[220px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(115,87,255,0.10),transparent_68%)]" />
      </div>
    </div>
  );
}
