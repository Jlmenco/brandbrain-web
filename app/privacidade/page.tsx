import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — Brand Brain",
  description: "Política de privacidade e proteção de dados do Brand Brain, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
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
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: 14 de março de 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
            <p>
              A plataforma <strong>Brand Brain</strong> (&quot;nós&quot;, &quot;nosso&quot;) é operada por <strong>TecnoEPec Tecnologia Ltda.</strong>, inscrita no CNPJ sob o nº <strong>39.764.993/0001-03</strong>.
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais quando você utiliza nosso site, aplicativo móvel e serviços relacionados (&quot;Plataforma&quot;).
            </p>
            <p>
              Ao utilizar a Plataforma, você concorda com as práticas descritas nesta política, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Dados que coletamos</h2>

            <h3 className="text-base font-medium mt-4 mb-2">2.1. Dados fornecidos por você</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cadastro:</strong> nome, e-mail e senha.</li>
              <li><strong>Organização:</strong> nome da empresa, tipo de conta (Solo, Agência, Grupo) e informações de membros convidados (e-mail e cargo).</li>
              <li><strong>Conteúdo:</strong> textos, imagens, vídeos e materiais de marca (brand kit) que você cria ou envia pela Plataforma.</li>
              <li><strong>Pagamento:</strong> dados processados pela Asaas (gateway de pagamento). Não armazenamos dados de cartão de crédito em nossos servidores.</li>
            </ul>

            <h3 className="text-base font-medium mt-4 mb-2">2.2. Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Uso da Plataforma:</strong> páginas acessadas, ações realizadas (audit log), data e hora.</li>
              <li><strong>Dispositivo:</strong> tipo de dispositivo, sistema operacional e navegador (via Google Analytics).</li>
              <li><strong>Cookies:</strong> utilizamos cookies essenciais para autenticação (JWT token) e Google Analytics para métricas de uso.</li>
              <li><strong>Push tokens:</strong> tokens de notificação push (Expo) quando você autoriza no aplicativo móvel.</li>
            </ul>

            <h3 className="text-base font-medium mt-4 mb-2">2.3. Dados de redes sociais</h3>
            <p>
              Ao conectar contas de redes sociais (LinkedIn, Meta/Facebook/Instagram, TikTok, YouTube), coletamos tokens de acesso OAuth para publicação de conteúdo e sincronização de métricas.
              Esses tokens são <strong>criptografados (Fernet)</strong> antes do armazenamento.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fornecer, manter e melhorar os serviços da Plataforma.</li>
              <li>Gerenciar sua conta, autenticação e controle de acesso (RBAC).</li>
              <li>Processar criação, aprovação, agendamento e publicação de conteúdo nas redes sociais.</li>
              <li>Gerar conteúdo com inteligência artificial (textos, avatares, vídeos) usando dados do seu brand kit.</li>
              <li>Sincronizar métricas de desempenho das suas publicações.</li>
              <li>Enviar notificações (in-app, push e e-mail) sobre atividades relevantes.</li>
              <li>Processar pagamentos e gerenciar assinaturas via Asaas.</li>
              <li>Analisar uso agregado da Plataforma para melhorias (Google Analytics).</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de dados</h2>
            <p>Compartilhamos seus dados apenas com os seguintes prestadores de serviço, estritamente necessários para o funcionamento da Plataforma:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Prestador</th>
                    <th className="text-left py-2 pr-4 font-medium">Finalidade</th>
                    <th className="text-left py-2 font-medium">Dados</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="py-2 pr-4">OpenAI</td><td className="py-2 pr-4">Geração de texto e avatares (GPT, DALL-E 3)</td><td className="py-2">Textos de brand kit e prompts</td></tr>
                  <tr><td className="py-2 pr-4">Anthropic</td><td className="py-2 pr-4">Geração de texto (Claude)</td><td className="py-2">Textos de brand kit e prompts</td></tr>
                  <tr><td className="py-2 pr-4">ElevenLabs</td><td className="py-2 pr-4">Síntese de voz (TTS)</td><td className="py-2">Textos para narração</td></tr>
                  <tr><td className="py-2 pr-4">Hedra</td><td className="py-2 pr-4">Geração de vídeo (lip-sync)</td><td className="py-2">Imagem de avatar e áudio</td></tr>
                  <tr><td className="py-2 pr-4">Asaas</td><td className="py-2 pr-4">Processamento de pagamentos</td><td className="py-2">E-mail, nome, dados de cobrança</td></tr>
                  <tr><td className="py-2 pr-4">Amazon Web Services</td><td className="py-2 pr-4">Hospedagem e envio de e-mail (SES)</td><td className="py-2">Todos os dados (armazenamento)</td></tr>
                  <tr><td className="py-2 pr-4">Google Analytics</td><td className="py-2 pr-4">Análise de uso do site</td><td className="py-2">Dados anonimizados de navegação</td></tr>
                  <tr><td className="py-2 pr-4">LinkedIn / Meta / TikTok / YouTube</td><td className="py-2 pr-4">Publicação de conteúdo e métricas</td><td className="py-2">Conteúdo criado e tokens OAuth</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de marketing.</p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Base legal para o tratamento</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Execução de contrato</strong> (Art. 7º, V — LGPD): para fornecer os serviços contratados.</li>
              <li><strong>Consentimento</strong> (Art. 7º, I — LGPD): para envio de comunicações e uso de cookies não essenciais.</li>
              <li><strong>Legítimo interesse</strong> (Art. 7º, IX — LGPD): para melhorias da Plataforma e segurança.</li>
              <li><strong>Obrigação legal</strong> (Art. 7º, II — LGPD): para cumprimento de obrigações fiscais e regulatórias.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Armazenamento e segurança</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Seus dados são armazenados em servidores da <strong>Amazon Web Services (AWS)</strong> na região <strong>us-east-1</strong> (N. Virginia, EUA).</li>
              <li>Senhas são armazenadas com hash <strong>bcrypt</strong> (nunca em texto plano).</li>
              <li>Tokens de redes sociais são criptografados com <strong>Fernet (AES-128-CBC)</strong>.</li>
              <li>Comunicações são protegidas por <strong>HTTPS/TLS</strong> em trânsito.</li>
              <li>Acesso ao banco de dados é restrito via VPC privada e credenciais gerenciadas pelo AWS Secrets Manager.</li>
              <li>Autenticação via <strong>JWT (HS256)</strong> com expiração configurável.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Retenção de dados</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados da conta:</strong> mantidos enquanto sua conta estiver ativa.</li>
              <li><strong>Conteúdo criado:</strong> mantido enquanto sua conta estiver ativa ou até exclusão voluntária.</li>
              <li><strong>Logs de auditoria:</strong> mantidos por 12 meses para fins de segurança e compliance.</li>
              <li><strong>Dados de pagamento:</strong> mantidos conforme exigências fiscais brasileiras (5 anos).</li>
              <li>Após encerramento da conta, seus dados serão excluídos em até <strong>30 dias</strong>, exceto quando houver obrigação legal de retenção.</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Seus direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los.</li>
              <li><strong>Correção:</strong> solicitar correção de dados incompletos ou desatualizados.</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade.</li>
              <li><strong>Portabilidade:</strong> solicitar a transferência dos seus dados a outro fornecedor.</li>
              <li><strong>Eliminação:</strong> solicitar a exclusão dos dados tratados com base no consentimento.</li>
              <li><strong>Revogação do consentimento:</strong> revogar o consentimento a qualquer momento.</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento quando realizado com base em legítimo interesse.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer desses direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail indicado na seção 11.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Cookies</h2>
            <p>Utilizamos os seguintes tipos de cookies:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essenciais:</strong> token de autenticação (JWT) armazenado em localStorage, preferência de tema (dark/light) e idioma. Necessários para o funcionamento da Plataforma.</li>
              <li><strong>Analíticos:</strong> Google Analytics para entender padrões de uso e melhorar a experiência. Os dados são anonimizados.</li>
            </ul>
            <p className="mt-2">Você pode desabilitar cookies analíticos nas configurações do seu navegador.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Transferência internacional de dados</h2>
            <p>
              Seus dados podem ser processados fora do Brasil pelos prestadores listados na seção 4 (OpenAI, Anthropic, ElevenLabs, Hedra, AWS, Google).
              Essas transferências são realizadas com base no <strong>Art. 33, II da LGPD</strong>, garantindo que os destinatários adotem medidas de segurança adequadas para proteger seus dados.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contato e Encarregado (DPO)</h2>
            <p>Para dúvidas, solicitações ou exercício dos seus direitos, entre em contato:</p>
            <div className="bg-muted/50 rounded-lg p-4 mt-3 space-y-1">
              <p><strong>Encarregado de Proteção de Dados (DPO)</strong></p>
              <p>TecnoEPec Tecnologia Ltda.</p>
              <p>CNPJ: 39.764.993/0001-03</p>
              <p>E-mail: <a href="mailto:juliano.menezes@tecnoepec.com.br" className="text-violet-600 hover:underline">juliano.menezes@tecnoepec.com.br</a></p>
            </div>
            <p className="mt-3">
              Responderemos à sua solicitação em até <strong>15 dias úteis</strong>, conforme previsto na LGPD.
              Caso não fique satisfeito com a resposta, você pode apresentar reclamação à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas por e-mail ou aviso na Plataforma.
              A data da última atualização será sempre indicada no topo deste documento.
            </p>
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
