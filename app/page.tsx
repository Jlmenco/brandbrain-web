import Link from "next/link";
import { Zap, Users, Building2, Check, ArrowRight, Brain, BarChart3, Calendar } from "lucide-react";

const PLANS = [
  {
    id: "solo",
    name: "Solo",
    price: "R$ 297",
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    description: "Para empreendedores e criadores que gerenciam a própria marca.",
    features: [
      "1 influenciador",
      "Criação de posts com IA",
      "Publicação automática",
      "Dashboard simplificado",
      "10 vídeos gerados/mês",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    id: "agency",
    name: "Agência",
    price: "R$ 697",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    description: "Para agências e times de marketing com múltiplos clientes.",
    features: [
      "Até 10 influenciadores",
      "RBAC completo",
      "Workflow de aprovação",
      "Webhooks e audit log",
      "Export CSV/PDF",
      "50 vídeos gerados/mês",
    ],
    cta: "Começar grátis",
    highlight: true,
  },
  {
    id: "grupo",
    name: "Grupo",
    price: "R$ 1.497",
    icon: <Building2 className="h-6 w-6 text-purple-500" />,
    description: "Para franquias e grupos com múltiplas unidades ou filiais.",
    features: [
      "Influenciadores ilimitados",
      "Dashboard consolidado de filiais",
      "Billing centralizado",
      "Vídeos ilimitados",
      "Tudo do plano Agência",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: <Brain className="h-8 w-8 text-violet-500" />,
    title: "IA que conhece sua marca",
    description: "RAG com embeddings do seu brand kit garante que cada post gerado soe como você.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
    title: "Publicação automática",
    description: "Agende posts para LinkedIn, Instagram, Facebook, TikTok e YouTube em um só lugar.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
    title: "Resultados em tempo real",
    description: "Métricas de alcance, engajamento e leads diretamente no dashboard.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-violet-600">Brand Brain</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          30 dias grátis, sem cartão
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Inteligência de marca{" "}
          <span className="text-violet-600">autônoma</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Crie, aprove e publique conteúdo em todas as redes sociais com IA treinada na identidade da sua marca.
          Do rascunho ao post em minutos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors font-semibold text-base"
          >
            Criar conta grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Tudo que você precisa para crescer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card border rounded-xl p-6 space-y-3">
                {f.icon}
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Planos e preços</h2>
          <p className="text-muted-foreground text-center mb-12">
            Todos os planos incluem 30 dias grátis. Sem cartão de crédito.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-2xl p-6 space-y-5 relative ${
                  plan.highlight
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-lg"
                    : "bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full font-medium">
                      Mais popular
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {plan.icon}
                  <p className="font-bold text-lg">{plan.name}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">/mês após o período grátis</p>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground space-y-2">
        <p>&copy; 2026 Brand Brain — contato@brandbrain.com.br</p>
        <p>
          <Link href="/privacidade" className="hover:text-foreground transition-colors underline underline-offset-4">
            Política de Privacidade
          </Link>
        </p>
      </footer>
    </div>
  );
}
