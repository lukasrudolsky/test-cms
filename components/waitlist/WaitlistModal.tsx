"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { WaitlistContent } from "@/types/content";
import { closeWaitlist, getServerSnapshot, getSnapshot, subscribe } from "@/lib/waitlistStore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistModal({ content }: { content: WaitlistContent }) {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setStatus("idle");
    setEmail("");
    emailInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWaitlist();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeWaitlist}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#15141c] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/0 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-60px] top-[-60px] h-[220px] w-[220px] rounded-full bg-[#7357ff]/25 blur-3xl"
        />

        <button
          type="button"
          onClick={closeWaitlist}
          aria-label="Zavřít"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="relative">
            <div className="grid size-11 place-items-center rounded-full bg-[#7357ff]">
              <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
            <h2 id="waitlist-title" className="mt-5 text-[22px] font-medium tracking-[-0.03em] text-white">
              {content.successTitle}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.5] text-white/60">{content.successMessage}</p>
          </div>
        ) : (
          <form className="relative" onSubmit={handleSubmit} noValidate>
            <h2 id="waitlist-title" className="text-[22px] font-medium tracking-[-0.03em] text-white">
              {content.title}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.5] text-white/60">{content.description}</p>

            <label htmlFor="waitlist-email" className="sr-only">
              {content.emailPlaceholder}
            </label>
            <input
              ref={emailInputRef}
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={content.emailPlaceholder}
              className="mt-6 h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#7357ff]/60"
            />

            {status === "error" && (
              <p className="mt-2 text-[13px] text-[#ff8a8a]">Zadej prosím platný e-mail.</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#7357ff] px-6 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_12px_24px_rgba(115,87,255,0.24)] transition-transform hover:-translate-y-px disabled:pointer-events-none disabled:opacity-60"
            >
              {status === "submitting" ? "Odesílám…" : content.buttonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
