"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bb_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("bb_cookie_consent", "accepted");
    setVisible(false);
    // Enable GA if gtag exists
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  function reject() {
    localStorage.setItem("bb_cookie_consent", "rejected");
    setVisible(false);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-card border-t shadow-lg p-4 md:p-5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos (Google Analytics) para
          melhorar sua experiência. Ao aceitar, você concorda com nossa{" "}
          <Link href="/privacidade" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reject}
            className="text-sm px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
