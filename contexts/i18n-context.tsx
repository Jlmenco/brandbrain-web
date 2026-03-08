"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Locale,
  getLocale,
  setLocale as persistLocale,
  tWithLocale,
  getAvailableLocales,
} from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Tipos do contexto
// ---------------------------------------------------------------------------

interface I18nContextValue {
  /** Locale ativo */
  locale: Locale;
  /** Altera o locale (salva no localStorage e re-renderiza consumidores) */
  setLocale: (locale: Locale) => void;
  /** Funcao de traducao reativa — re-renderiza ao trocar locale */
  t: (key: string) => string;
  /** Lista de locales disponiveis */
  availableLocales: { code: Locale; label: string }[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  // Inicializa a partir do localStorage ao montar (client-side)
  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    persistLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  const translate = useCallback(
    (key: string) => tWithLocale(key, locale),
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t: translate,
        availableLocales: getAvailableLocales(),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n deve ser usado dentro de um <I18nProvider>");
  }
  return ctx;
}
