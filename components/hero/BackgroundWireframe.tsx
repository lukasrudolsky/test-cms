export default function BackgroundWireframe() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[104px] z-0 hidden h-[760px] select-none overflow-hidden xl:block"
      aria-hidden="true"
    >
      <img
        src="/generated/hero-wireframe-bg.jpg"
        alt=""
        className="h-full w-full object-cover opacity-[0.78]"
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(244,244,246,0.92)_0%,rgba(244,244,246,0.72)_34%,rgba(244,244,246,0.12)_66%,rgba(244,244,246,0)_100%)]" />
    </div>
  );
}
