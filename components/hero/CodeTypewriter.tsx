"use client";

import { useEffect, useState } from "react";

const CODE_SNIPPET = `import { EnokiClient } from
  '@mysten/enoki';

const client = new EnokiClient({
  apiKey: ENOKI_API_KEY,
  network: 'mainnet',
  appUrl: 'https://app.enoki.dev',
});`;

export default function CodeTypewriter({ className = "" }: { className?: string }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    let direction: 1 | -1 = 1;
    let hold = 0;

    const interval = window.setInterval(() => {
      setLength((current) => {
        if (hold > 0) {
          hold -= 1;
          return current;
        }

        if (current >= CODE_SNIPPET.length) {
          direction = -1;
          hold = 18;
        } else if (current <= 0) {
          direction = 1;
          hold = 8;
        }

        return Math.max(0, Math.min(CODE_SNIPPET.length, current + direction * 2));
      });
    }, 46);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <pre className={`${className} font-mono text-[10px] leading-[1.45] text-white/70`}>
      {CODE_SNIPPET.slice(0, length)}
    </pre>
  );
}
