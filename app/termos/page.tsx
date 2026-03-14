import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — Brand Brain",
  description: "Termos e condições de uso da plataforma Brand Brain.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <span className="text-lg font-bold text-violet-600">Brand Brain</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: 14 de março de 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma <strong>Brand Brain</strong> (&quot;Plataforma&quot;), operada por <strong>TecnoEPec Tecnologia Ltda.</strong> (CNPJ 39.764.993/0001-03), você declara que leu, entendeu e concorda com estes Termos de Uso.
              Caso não concorde com qualquer disposição, não utilize a Plataforma.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p>
              O Brand Brain é uma plataforma de inteligência de marca autônoma que permite:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Criação de conteúdo com inteligência artificial treinada na identidade da sua marca.</li>
              <li>Gerenciamento de fluxo de aprovação de conteúdo (rascunho, revisão, aprovação, publicação).</li>
              <li>Publicação automática em redes sociais (LinkedIn, Facebook, Instagram, TikTok, YouTube).</li>
              <li>Geração de avatares, vídeos e áudio com IA.</li>
              <li>Monitoramento de métricas e desempenho de publicações.</li>
              <li>Gerenciamento de leads, campanhas e links de rastreamento.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Cadastro e Conta</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Você deve fornecer informações verdadeiras e completas no momento do cadastro.</li>
              <li>Você é responsável por manter a confidencialidade da sua senha e pela atividade em sua conta.</li>
              <li>Cada conta é pessoal e intransferível. O compartilhamento de credenciais é proibido.</li>
              <li>Você deve notificar imediatamente qualquer uso não autorizado da sua conta.</li>
              <li>Menores de 18 anos não podem utilizar a Plataforma sem autorização de um responsável legal.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Planos e Pagamento</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A Plataforma oferece os planos <strong>Solo</strong> (R$ 297/mês), <strong>Agência</strong> (R$ 697/mês) e <strong>Grupo</strong> (R$ 1.497/mês).</li>
              <li>Todos os planos incluem um <strong>período de teste gratuito de 30 dias</strong>, sem necessidade de cartão de crédito.</li>
              <li>Após o período de teste, o acesso será restrito até a contratação de um plano pago.</li>
              <li>Os pagamentos são processados pela <strong>Asaas</strong>. Não armazenamos dados de cartão de crédito.</li>
              <li>As cobranças são <strong>recorrentes e mensais</strong>. Você pode cancelar a qualquer momento.</li>
              <li>Não há reembolso proporcional para cancelamentos no meio do ciclo de cobrança.</li>
              <li>Reservamo-nos o direito de alterar os valores dos planos com aviso prévio de 30 dias.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Uso Aceitável</h2>
            <p>Ao utilizar a Plataforma, você concorda em <strong>não</strong>:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Utilizar o serviço para fins ilegais ou não autorizados.</li>
              <li>Publicar conteúdo que viole direitos de terceiros (propriedade intelectual, imagem, privacidade).</li>
              <li>Gerar conteúdo discriminatório, difamatório, violento ou que incite ódio.</li>
              <li>Tentar acessar contas de outros usuários ou dados de outras organizações.</li>
              <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte da Plataforma.</li>
              <li>Utilizar bots, scrapers ou outros meios automatizados para acessar a Plataforma sem autorização.</li>
              <li>Sobrecarregar intencionalmente os servidores ou infraestrutura da Plataforma.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Conteúdo do Usuário</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Você mantém todos os <strong>direitos de propriedade intelectual</strong> sobre o conteúdo que cria ou envia pela Plataforma.</li>
              <li>Ao utilizar a Plataforma, você nos concede uma <strong>licença limitada</strong> para armazenar, processar e transmitir seu conteúdo exclusivamente para a prestação do serviço.</li>
              <li>O conteúdo gerado por IA (textos, avatares, vídeos) é de sua responsabilidade. Recomendamos revisão antes da publicação.</li>
              <li>Não nos responsabilizamos por conteúdo publicado sem revisão prévia nas redes sociais.</li>
              <li>Dados do brand kit são utilizados para personalizar a geração de conteúdo e são tratados conforme nossa <Link href="/privacidade" className="text-violet-600 hover:underline">Política de Privacidade</Link>.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Integrações com Redes Sociais</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A Plataforma permite conectar contas de redes sociais via OAuth para publicação e métricas.</li>
              <li>Ao conectar uma conta, você autoriza a Plataforma a publicar conteúdo e acessar métricas em seu nome.</li>
              <li>A Plataforma não se responsabiliza por alterações nas APIs das redes sociais que possam afetar o serviço.</li>
              <li>Você pode desconectar suas contas sociais a qualquer momento pela página de integrações.</li>
              <li>O uso das redes sociais está sujeito aos termos de serviço de cada plataforma (LinkedIn, Meta, TikTok, YouTube).</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Quotas e Limites</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cada plano possui limites de uso para recursos como geração de vídeos, avatares e tokens de IA.</li>
              <li>Ao atingir o limite de quota, a funcionalidade correspondente será temporariamente indisponível até o próximo ciclo.</li>
              <li>Os limites atuais estão descritos na página de planos e podem ser consultados em <strong>/billing</strong>.</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Disponibilidade e SLA</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nos esforçamos para manter a Plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta.</li>
              <li>Manutenções programadas serão comunicadas com antecedência sempre que possível.</li>
              <li>Não nos responsabilizamos por indisponibilidades causadas por provedores terceiros (AWS, redes sociais, Asaas).</li>
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Limitação de Responsabilidade</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A Plataforma é fornecida &quot;como está&quot;, sem garantias expressas ou implícitas.</li>
              <li>Não garantimos que o conteúdo gerado por IA seja preciso, adequado ou livre de erros.</li>
              <li>Nossa responsabilidade total está limitada ao valor pago pelo plano nos últimos 12 meses.</li>
              <li>Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais resultantes do uso da Plataforma.</li>
              <li>Não nos responsabilizamos por perdas decorrentes de publicações em redes sociais feitas pela Plataforma a pedido do usuário.</li>
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Suspensão e Encerramento</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Podemos suspender ou encerrar sua conta em caso de violação destes Termos.</li>
              <li>Você pode solicitar o encerramento da sua conta a qualquer momento.</li>
              <li>Após o encerramento, seus dados serão tratados conforme a <Link href="/privacidade" className="text-violet-600 hover:underline">Política de Privacidade</Link> (seção 7 — Retenção).</li>
              <li>A suspensão por inadimplência não isenta o pagamento de valores devidos.</li>
            </ul>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Propriedade Intelectual</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A marca &quot;Brand Brain&quot;, o código-fonte, design e documentação da Plataforma são propriedade da TecnoEPec Tecnologia Ltda.</li>
              <li>Nenhuma disposição destes Termos transfere qualquer direito de propriedade intelectual da Plataforma ao usuário.</li>
              <li>O uso da marca &quot;Brand Brain&quot; sem autorização expressa é proibido.</li>
            </ul>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes Termos de Uso periodicamente. Alterações significativas serão comunicadas por e-mail ou aviso na Plataforma com antecedência mínima de <strong>15 dias</strong>.
              O uso continuado da Plataforma após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">14. Legislação e Foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil.
              Fica eleito o <strong>Foro da Comarca de Teresina/PI</strong> para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">15. Contato</h2>
            <div className="bg-muted/50 rounded-lg p-4 mt-3 space-y-1">
              <p><strong>TecnoEPec Tecnologia Ltda.</strong></p>
              <p>CNPJ: 39.764.993/0001-03</p>
              <p>E-mail: <a href="mailto:juliano.menezes@tecnoepec.com.br" className="text-violet-600 hover:underline">juliano.menezes@tecnoepec.com.br</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Brand Brain — TecnoEPec Tecnologia Ltda. — CNPJ 39.764.993/0001-03</p>
      </footer>
    </div>
  );
}
