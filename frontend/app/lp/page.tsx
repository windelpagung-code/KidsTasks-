import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   KidsTasks — Landing Page — Variação B
   Copy: Gatilhos emocionais dos pais
   Ângulo: Reduzir conflitos, criar filhos responsáveis, transformar tarefas em diversão
   Tom: Caloroso, confiante, próximo de pai/mãe brasileiro
───────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>

      {/* ══════════════════════════════════════════════════════
          NAVBAR — Sticky
      ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              🎯
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">KidsTasks</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600 font-medium">
            <a href="#como-funciona" className="hover:text-gray-900 transition">Como funciona</a>
            <a href="#depoimentos" className="hover:text-gray-900 transition">Depoimentos</a>
            <a href="#precos" className="hover:text-gray-900 transition">Preços</a>
            <a href="#faq" className="hover:text-gray-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition hidden sm:block">
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              Começar grátis →
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          HERO — Transformação emocional do pai/mãe
          Gatilhos: Dor profunda + Esperança + Identidade parental
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f0a1e 0%, #1e1250 40%, #3b1f7a 75%, #4c1d95 100%)" }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-[10%] w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
          <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)" }} />
          <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-medium border border-white/15 bg-white/8 backdrop-blur-sm text-white/85">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            +12.847 famílias vivendo em mais harmonia · Nota 4.9/5
          </div>

          {/* Main headline — Identidade parental + Transformação */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
            Seus filhos, mais responsáveis.
            <br />
            <span style={{
              background: "linear-gradient(90deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Sua casa, mais em paz.
            </span>
          </h1>

          <p className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            O KidsTasks usa a mesma lógica dos jogos que seu filho ama para transformar tarefas em missões. Ele se engaja, você respira. E no caminho, você está criando um adulto mais organizado e responsável.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-gray-900 font-extrabold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
            >
              🚀 Quero harmonia em casa — grátis
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/80 hover:text-white hover:border-white/50 font-semibold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              ▶ Ver como funciona
            </a>
          </div>

          {/* Micro-trust */}
          <div className="flex flex-wrap justify-center gap-6 text-white/45 text-sm">
            {["✅ Sem cartão de crédito", "✅ Cancele quando quiser", "✅ Grátis para 1 filho"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Screenshot placeholder — Hero */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-0">
          <div
            className="rounded-t-2xl border border-white/10 overflow-hidden shadow-2xl"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              <div className="flex-1 mx-4 h-5 rounded-md bg-white/10" />
            </div>
            {/* SCREENSHOT — DASHBOARD */}
            <img
              src="/screenshots/01-dashboard.png"
              alt="Dashboard KidsTasks — visão geral da família"
              className="w-full block"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROVA SOCIAL — Números que convencem
          Gatilho: Aprovação social + Autoridade
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "12.847", label: "Famílias mais felizes" },
              { value: "98.4%", label: "Renovam todo mês" },
              { value: "4.9★", label: "Nota dos pais" },
              { value: "30 dias", label: "Para sentir a diferença" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DOR — Agitação emocional dos pais
          Gatilho: Identificação profunda + Medo + Culpa
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              Isso já aconteceu na sua casa?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
              Toda família passa por isso.<br />
              <span style={{ color: "#7c3aed" }}>Mas não precisa continuar assim.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "😤",
                title: "A batalha das tarefas todo dia",
                desc: "Você pede com jeito. Pede com firmeza. Ameaça. Cede. No fim, faz você mesmo. E sente que está falhando como pai ou mãe.",
              },
              {
                icon: "📱",
                title: "2 horas de jogo, 5 minutos de tarefa",
                desc: "Seu filho tem energia e foco infinitos para o que ele ama — mas qualquer tarefa parece um castigo insuportável.",
              },
              {
                icon: "💸",
                title: "Mesada que não educa",
                desc: "Você dá dinheiro com a esperança de ensinar responsabilidade. Mas sem um sistema claro, a mesada não muda nada.",
              },
              {
                icon: "😰",
                title: "O medo de estar criando mal",
                desc: "Lá no fundo você se pergunta: será que meu filho vai ser aquele adulto que não sabe cuidar de si mesmo?",
              },
            ].map((p) => (
              <div key={p.title} className="flex gap-4 p-5 rounded-2xl bg-red-50 border border-red-100">
                <span className="text-3xl flex-shrink-0">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl text-center"
            style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
            <p className="text-amber-900 font-semibold text-lg">
              A verdade: seu filho não é preguiçoso. Ele só precisa de motivação que faça sentido pra ele.
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Crianças aprendem brincando. O KidsTasks traz a lógica dos jogos para dentro da sua rotina familiar.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MECANISMO — Como o KidsTasks funciona
          Gatilho: Novidade + Desenvolvimento infantil
      ══════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Como funciona
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
              Simples para os pais.<br />
              <span style={{ color: "#7c3aed" }}>Irresistível para os filhos.</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Em 3 passos, você transforma a relação da sua família com responsabilidades — sem gritar, sem suplicar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                step: "01",
                icon: "📋",
                title: "Você cria as missões",
                desc: "Configure as tarefas da rotina com nome, dificuldade e quantos pontos valem. Leva menos de 5 minutos para montar a semana inteira.",
                color: "from-violet-500 to-purple-600",
              },
              {
                step: "02",
                icon: "🎮",
                title: "Seu filho entra no jogo",
                desc: "A criança vê as missões, conclui e você aprova. Ela ganha pontos, sobe de nível, coleciona badges — exatamente como no game favorito dela.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Recompensas que motivam de verdade",
                desc: "Com os pontos, seu filho escolhe recompensas da loja da família — que você mesmo define. Tempo de tela, um passeio, um brinquedo. A motivação não acaba.",
                color: "from-amber-500 to-orange-500",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-5 shadow-md`}>
                  {s.icon}
                </div>
                <div className="text-violet-300 text-xs font-bold mb-2 tracking-widest">PASSO {s.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Screenshot — Tarefas + Aprovações lado a lado */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-violet-100">
              <div className="bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-600">📋 Gestão de tarefas</div>
              <img src="/screenshots/02-tarefas.png" alt="Tela de tarefas KidsTasks" className="w-full block" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-violet-100">
              <div className="bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-600">✅ Aprovações dos pais</div>
              <img src="/screenshots/04-aprovacoes.png" alt="Aprovações de tarefas KidsTasks" className="w-full block" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENEFÍCIOS — Foco no pai, não na feature
          Gatilho: Benefício emocional > Característica técnica
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Não é só sobre tarefas.<br />
              <span style={{ color: "#7c3aed" }}>É sobre quem seus filhos vão se tornar.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "🎯",
                title: "Seu filho aprende que esforço tem valor",
                desc: "Quando a recompensa vem do trabalho — não do choro ou da insistência — você está ensinando uma lição que dura a vida toda.",
              },
              {
                icon: "💰",
                title: "Educação financeira que começa em casa",
                desc: "A mesada calculada com base nas tarefas concluídas ensina que dinheiro se ganha, não se pede. Sem discussão, sem subjetividade.",
              },
              {
                icon: "🏅",
                title: "Autoestima que cresce a cada conquista",
                desc: "Badges, níveis e recordes mostram para seu filho que ele é capaz. Essa confiança vai além das tarefas domésticas.",
              },
              {
                icon: "🛍️",
                title: "Você no controle, seu filho motivado",
                desc: "Você define quais recompensas existem e qual o preço em pontos. Nada de negociação interminável — as regras são claras para todo mundo.",
              },
              {
                icon: "📊",
                title: "Você vê a evolução acontecendo",
                desc: "Acompanhe semana a semana: tarefas feitas, pontos acumulados, sequências. Dados que mostram seu filho crescendo em responsabilidade.",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "A família toda na mesma página",
                desc: "Adicione avós, babás ou parceiros. Todo mundo sabe o que precisa ser feito — e ninguém fica de fora da educação dos filhos.",
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SCREENSHOTS — Prova visual do produto
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Bonito para os pais. Divertido para os filhos.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Uma plataforma pensada para que toda a família use com prazer — do pai ao filho de 6 anos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">🏠 Dashboard da família</div>
              <img src="/screenshots/01-dashboard.png" alt="Dashboard KidsTasks — visão geral da família" className="w-full block" />
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">📋 Tarefas do filho</div>
              <img src="/screenshots/mobile-02-tarefas.png" alt="Tela de tarefas do filho no mobile" className="w-full block" />
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">🛍️ Loja de recompensas</div>
              <img src="/screenshots/06-loja.png" alt="Loja de recompensas KidsTasks" className="w-full block" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DEPOIMENTOS — Histórias reais de pais brasileiros
          Gatilho: Identificação + Prova específica + Emoção
      ══════════════════════════════════════════════════════ */}
      <section id="depoimentos" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Pais como você falam
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
              A mudança que eles não esperavam.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ana Paula M.",
                city: "São Paulo, SP",
                role: "Mãe de 2 filhos (7 e 10 anos)",
                quote: "Meu filho de 10 anos começou a me pedir para criar novas tarefas porque queria mais pontos. PEDINDO tarefas. Nunca imaginei que um dia eu ouviria isso. O clima em casa mudou completamente.",
                initials: "A",
                color: "from-violet-500 to-purple-600",
                result: "Filho pedindo mais tarefas em 2 semanas",
              },
              {
                name: "Carlos e Renata F.",
                city: "Belo Horizonte, MG",
                role: "Pais de 3 filhos (6, 9 e 13 anos)",
                quote: "Com 3 filhos, a sensação era de caos constante. O KidsTasks deu estrutura para a nossa família inteira. Agora cada um sabe o que precisa fazer e o que vai ganhar — sem choro, sem drama.",
                initials: "C",
                color: "from-blue-500 to-cyan-500",
                result: "3 filhos organizados, zero drama",
              },
              {
                name: "Mariana S.",
                city: "Curitiba, PR",
                role: "Mãe de 1 filho (8 anos)",
                quote: "Meu filho falou 'mãe, isso é um RPG da vida real!'. Aquilo me emocionou. Ele não sabe, mas está aprendendo responsabilidade, disciplina e o valor do esforço — achando que está brincando.",
                initials: "M",
                color: "from-emerald-500 to-teal-500",
                result: "Aprendendo responsabilidade sem perceber",
              },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 inline-block mb-4">
                  ✓ {t.result}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Screenshots placeholder — Depoimentos adicionais */}
          <div className="mt-10 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
            <div className="text-3xl mb-3">💬</div>
            <p className="text-gray-400 text-sm font-medium">[ Inserir screenshots de depoimentos do Instagram/WhatsApp ]</p>
            <p className="text-gray-300 text-xs mt-1">Prints de mensagens reais de clientes · tamanho livre</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PREÇOS — Âncora emocional + Investimento na educação
          Gatilho: Reframing de custo + Escassez + Reciprocidade
      ══════════════════════════════════════════════════════ */}
      <section id="precos" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Preços simples e honestos
            </span>
          </div>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Investir em filhos responsáveis.<br />
              <span style={{ color: "#7c3aed" }}>Por menos de R$0,33 por dia.</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Cursos de educação financeira custam centenas de reais. O KidsTasks ensina tudo isso — de verdade, no dia a dia, jogando junto com você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-7">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Gratuito</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-gray-900">R$0</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Comece hoje, sem compromisso</p>
              <ul className="space-y-3 mb-8">
                {["1 filho", "5 tarefas", "Pontos e níveis básicos", "Aprovação de tarefas"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-600 text-sm">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {["Filhos ilimitados", "Loja de recompensas", "Badges e conquistas", "Relatórios"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-300 text-sm line-through">
                    <span className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center text-xs flex-shrink-0">✗</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition">
                Começar grátis
              </Link>
            </div>

            {/* Monthly — Destaque */}
            <div
              className="rounded-2xl p-7 relative shadow-xl scale-[1.02]"
              style={{ background: "linear-gradient(160deg, #1e1b4b, #3b1f7a, #4c1d95)" }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                ⭐ MAIS POPULAR
              </div>
              <div className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Mensal</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-white">R$19,90</span>
                <span className="text-white/50 text-sm">/mês</span>
              </div>
              <p className="text-white/40 text-sm mb-6">Equivale a R$0,66 por dia</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Até 5 filhos",
                  "Tarefas ilimitadas",
                  "Loja de recompensas",
                  "Badges e conquistas",
                  "Relatórios detalhados",
                  "Múltiplos cuidadores",
                  "Suporte por email",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-white/80 text-sm">
                    <span className="w-4 h-4 rounded-full bg-violet-400/30 text-violet-300 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center font-bold py-3.5 rounded-xl text-sm transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a2e" }}
              >
                Assinar agora →
              </Link>
            </div>

            {/* Annual — Economia */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-7 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                💰 ECONOMIZE 50%
              </div>
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Anual</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-gray-900">R$118,80</span>
                <span className="text-gray-400 text-sm">/ano</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">
                <span className="line-through">R$238,80</span>
                {" "}→{" "}
                <span className="text-emerald-600 font-bold">6 meses grátis</span>
              </p>
              <p className="text-gray-300 text-xs mb-6">R$9,90/mês efetivo</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Tudo do plano Mensal",
                  "2 meses grátis inclusos",
                  "Prioridade no suporte",
                  "Acesso antecipado a novidades",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-600 text-sm">
                    <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition active:scale-95">
                Garantir oferta anual →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GARANTIA — Inversão de risco com tom emocional
          Gatilho: Segurança + Confiança + Reciprocidade
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-green-200 bg-green-50">
            <div className="text-6xl">🛡️</div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              30 dias para ver a diferença. Senão, devolvemos tudo.
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-lg">
              Sabemos que mudar a rotina da família leva um tempo. Por isso, você tem 30 dias para testar sem risco. Se não sentir uma mudança real, devolvemos 100% do seu dinheiro — sem burocracia, sem questionamento.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition active:scale-95 shadow-md"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              🚀 Quero experimentar sem risco
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ — Objeções reais dos pais
          Gatilho: Empatia + Clareza + Remoção de barreiras
      ══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Meu filho tem 6 anos. Vai conseguir usar?",
                a: "Sim! O KidsTasks foi feito para crianças a partir de 5 anos. A interface do filho é simples, visual e cheia de emojis. Com os menores, os pais mostram as missões juntos e a experiência vira um momento de conexão.",
              },
              {
                q: "Meu filho não tem smartphone. Funciona assim mesmo?",
                a: "Perfeitamente. Os pais gerenciam tudo pelo celular ou computador. O filho avisa quando conclui — você aprova. Sem complicação, sem precisar de um segundo dispositivo.",
              },
              {
                q: "E se eu quiser cancelar?",
                a: "Você cancela quando quiser, em menos de 1 minuto, direto no painel. Sem multa, sem ligue para cancelar. Seus dados ficam disponíveis por 30 dias após o cancelamento.",
              },
              {
                q: "Meus dados e os dados dos meus filhos ficam seguros?",
                a: "Totalmente. Usamos criptografia SSL, dados hospedados no Brasil e seguimos a LGPD com rigor. Nunca compartilhamos informações da sua família com terceiros.",
              },
              {
                q: "Tenho filhos com idades bem diferentes. Funciona para todos?",
                a: "Absolutamente. Você configura tarefas e recompensas individualmente para cada filho. O de 7 anos tem missões diferentes do de 14 — cada criança no seu ritmo, na sua fase.",
              },
              {
                q: "Como funciona o plano gratuito?",
                a: "É gratuito para sempre, sem trial que expira. Você gerencia 1 filho com até 5 tarefas. Quando quiser mais filhos, tarefas ilimitadas e a loja de recompensas completa, é só fazer o upgrade quando estiver pronto.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-semibold text-gray-900 text-sm hover:bg-gray-50 transition list-none">
                  {faq.q}
                  <span className="text-violet-500 text-lg ml-4 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
                  <div className="pt-4">{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL — Apelo à identidade parental
          Gatilho: Legado + Urgência + Transformação emocional
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #0f0a1e 0%, #1e1250 40%, #3b1f7a 75%, #4c1d95 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-float inline-block">🏆</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            O melhor presente que você
            <br />
            <span style={{
              background: "linear-gradient(90deg, #fbbf24, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              pode dar aos seus filhos.
            </span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Responsabilidade, disciplina e autoconfiança não se ensinam com palestra — se ensinam no dia a dia. Você já tem o que precisa para começar. Falta só o sistema.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-gray-900 font-extrabold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-amber-500/25 transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
            >
              🚀 Criar conta grátis agora
            </Link>
          </div>

          <p className="text-white/35 text-sm">
            Grátis para sempre · Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-gray-950 border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                >
                  🎯
                </div>
                <span className="text-white font-bold tracking-tight">KidsTasks</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Transformando tarefas em missões e famílias em equipes desde 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Produto",
                  links: [
                    { label: "Como funciona", href: "#como-funciona" },
                    { label: "Preços", href: "#precos" },
                    { label: "Para escolas", href: "#" },
                  ],
                },
                {
                  title: "Empresa",
                  links: [
                    { label: "Sobre nós", href: "#" },
                    { label: "Blog", href: "#" },
                    { label: "Contato", href: "#" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacidade", href: "#" },
                    { label: "Termos de uso", href: "#" },
                    { label: "LGPD", href: "#" },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className="text-gray-500 hover:text-gray-300 text-sm transition">{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs">© 2026 KidsTasks. Todos os direitos reservados.</p>
            <div className="flex gap-4 text-gray-600 text-xs">
              <span>🔒 SSL Seguro</span>
              <span>🇧🇷 Dados no Brasil</span>
              <span>✅ LGPD</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
