import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brand Brain — Inteligência de Marca Autônoma",
  description:
    "Crie, aprove e publique conteúdo em todas as redes sociais com IA treinada na identidade da sua marca. Do rascunho ao post em minutos.",
  openGraph: {
    title: "Brand Brain — Inteligência de Marca Autônoma",
    description:
      "Crie, aprove e publique conteúdo em todas as redes sociais com IA treinada na identidade da sua marca.",
    url: "https://brandbrain.tecnoepec.com.br",
    siteName: "Brand Brain",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Brain — Inteligência de Marca Autônoma",
    description:
      "Crie, aprove e publique conteúdo em todas as redes sociais com IA treinada na identidade da sua marca.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('bb_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
