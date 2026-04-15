import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   KidsTasks — Landing Page
   Copy structure: RMBC (Relevância → Mecanismo → Benefício → CTA)
   Gatilhos: Prova social, escassez, autoridade, reciprocidade,
             dor/medo, transformação, garantia
───────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>

      {/* ══════════════════════════════════════════════════════
          NAVBAR — Sticky
      ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="KidsTasks" width={48} height={48} />
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">KidsTasks</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600 font-medium">
            <a href="#como-funciona" className="hover:text-gray-900 transition">Como funciona</a>
            <a href="#depoimentos" className="hover:text-gray-900 transition">Depoimentos</a>
            <a href="#precos" className="hover:text-gray-900 transition">Preços</a>
            <a href="#faq" className="hover:text-gray-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
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
          HERO — R: Relevância / Resultado desejado
          Gatilhos: Dor + Transformação + Urgência suave
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
            +12.847 famílias transformadas · Nota 4.9/5
          </div>

          {/* Main headline — Dor + Transformação */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
            Chega de brigar com
            <br />
            <span style={{
              background: "linear-gradient(90deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              seu filho por tarefas.
            </span>
          </h1>

          <p className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            O KidsTasks transforma tarefas chatas em missões gamificadas. Seu filho ganha pontos, sobe de nível e troca por recompensas reais — e você finalmente tem paz em casa.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-gray-900 font-extrabold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
            >
              🚀 Criar conta grátis agora
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
            <img src="/screenshots/01-dashboard.png" alt="Dashboard KidsTasks — visão geral da família" className="w-full block" />
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
              { value: "12.847", label: "Famílias ativas" },
              { value: "98.4%", label: "Taxa de renovação" },
              { value: "4.9★", label: "Nota média" },
              { value: "30 dias", label: "Para ver resultado" },
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
          DOR — "Você reconhece essa situação?"
          Gatilho: Identificação + Agitação da dor
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              Você se identifica?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
              A rotina que toda família<br />
              <span style={{ color: "#7c3aed" }}>conhece de cor.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "😤",
                title: "\"Você disse que ia fazer!\"",
                desc: "Você pede. Ele promete. Não faz. Você cobra de novo. Ele reclama. Você cede. Todo dia.",
              },
              {
                icon: "📱",
                title: "Celular 4h, tarefas 0h",
                desc: "Seu filho passa horas em jogos e redes sociais — mas 15 minutos de tarefa parece impossível.",
              },
              {
                icon: "💸",
                title: "Mesada sem cobranças",
                desc: "Dá a mesada na esperança de motivar. Ele pega o dinheiro e as tarefas continuam sem fazer.",
              },
              {
                icon: "😰",
                title: "Sentimento de falha",
                desc: "Você fica se perguntando se está educando seu filho para ser irresponsável como adulto.",
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
              O problema não é seu filho — é a falta de um sistema que fale a língua dele.
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Crianças são naturalmente motivadas por jogos. O KidsTasks traz essa lógica para a vida real.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MECANISMO — Como o KidsTasks funciona
          Gatilho: Novidade + Mecanismo único
      ══════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              O mecanismo
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
              Por que funciona quando<br />
              <span style={{ color: "#7c3aed" }}>tudo mais falhou?</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Porque usamos a mesma psicologia dos jogos que mantêm seu filho grudado no celular — só que para tarefas de verdade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                step: "01",
                icon: "📋",
                title: "Pai cria as missões",
                desc: "Configure tarefas com nome, ícone, dificuldade e quantos pontos cada uma vale. Funciona com qualquer rotina.",
                color: "from-violet-500 to-purple-600",
              },
              {
                step: "02",
                icon: "🎮",
                title: "Filho completa e ganha XP",
                desc: "A criança marca como concluída, você aprova. Pontos, nível, badges — exatamente como um jogo.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Troca por recompensas reais",
                desc: "Com os pontos acumulados, seu filho escolhe recompensas na loja da família. Você define. Ele se motiva.",
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
          BENEFÍCIOS — Feature stack
          Gatilho: Benefício > Característica
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Tudo que sua família precisa<br />
              <span style={{ color: "#7c3aed" }}>em um só lugar.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "🎯",
                title: "Tarefas como missões gamificadas",
                desc: "Cada tarefa tem ícone, dificuldade (fácil, médio, difícil) e recompensa em pontos. Seu filho sabe exatamente o que ganhar.",
              },
              {
                icon: "💰",
                title: "Mesada automática vinculada ao esforço",
                desc: "Defina quanto cada ponto vale em reais. A mesada é calculada automaticamente com base nas tarefas concluídas. Zero discussão.",
              },
              {
                icon: "🏅",
                title: "Badges, níveis e ranking familiar",
                desc: "Conquistas especiais por sequências de tarefas, recordes e primeiros lugares. Motivação que não cansa.",
              },
              {
                icon: "🛍️",
                title: "Loja de recompensas personalizada",
                desc: "Crie recompensas que funcionam para sua família: tempo de tela extra, um passeio, um brinquedo. Você decide o preço em pontos.",
              },
              {
                icon: "📊",
                title: "Relatórios para pais",
                desc: "Veja o histórico completo de cada filho: tarefas feitas, pontos ganhos, evolução por semana. Dados que te mostram quem está crescendo.",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Múltiplos filhos e cuidadores",
                desc: "Adicione avós, babás e parceiros como editores ou visualizadores. A família toda conectada.",
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
              Veja o sistema em ação
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Uma plataforma pensada para ser bonita e intuitiva tanto para os pais quanto para os filhos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">🏠 Dashboard da família</div>
              <div className="overflow-hidden" style={{ height: 260 }}>
                <img src="/screenshots/01-dashboard.png" alt="Dashboard KidsTasks" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">📋 Tarefas do filho</div>
              <div className="overflow-hidden" style={{ height: 260 }}>
                <img src="/screenshots/mobile-02-tarefas.png" alt="Tarefas do filho no mobile" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-4 py-2 text-xs font-semibold text-violet-300">🛍️ Loja de recompensas</div>
              <div className="overflow-hidden" style={{ height: 260 }}>
                <img src="/screenshots/06-loja.png" alt="Loja de recompensas KidsTasks" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTROLE FINANCEIRO — Poupança dos filhos
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                💰 Educação financeira desde cedo
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
                Seu filho aprende o valor do dinheiro — de verdade.
              </h2>
              <p className="text-gray-500 text-lg mt-4 leading-relaxed">
                Cada tarefa concluída gera pontos que viram saldo na <strong className="text-gray-800">poupança virtual</strong> do seu filho. Ele vê em tempo real o quanto ganhou, gastou e guardou.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: "📈", text: "Gráfico de créditos, débitos e saldo — visual e fácil de entender" },
                  { icon: "🎯", text: "Filho define metas de economia para conquistar recompensas maiores" },
                  { icon: "🛍️", text: "Loja de recompensas integrada: troca pontos por prêmios reais" },
                  { icon: "👀", text: "Pais acompanham todo o histórico financeiro com transparência" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xl leading-none mt-0.5 flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-600 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-400 italic">
                "Minha filha de 9 anos agora pergunta quanto custa antes de pedir qualquer coisa." — Mãe usuária do KidsTasks
              </p>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
                <img src="/screenshots/05-carteira-grafico.png" alt="Gráfico de poupança e carteira KidsTasks" className="w-full block" />
              </div>
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Exclusivo KidsTasks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DEPOIMENTOS — Prova social
          Gatilho: Prova social + Identificação + Especificidade
      ══════════════════════════════════════════════════════ */}
      <section id="depoimentos" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              O que as famílias falam
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
              Resultados reais de famílias reais.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ana Paula M.",
                city: "São Paulo, SP",
                role: "Mãe de 2 filhos (7 e 10 anos)",
                quote: "Em 2 semanas meu filho de 10 anos começou a pedir para fazer tarefas. PEDINDO. Nunca pensei que veria isso acontecer. O KidsTasks mudou completamente a dinâmica da nossa casa.",
                initials: "A",
                color: "from-violet-500 to-purple-600",
                result: "2 semanas para transformar a rotina",
              },
              {
                name: "Carlos e Renata F.",
                city: "Belo Horizonte, MG",
                role: "Pais de 3 filhos (6, 9 e 13 anos)",
                quote: "Com 3 filhos era caos. Cada um com uma história diferente sobre as tarefas. Agora temos um sistema transparente — eles sabem exatamente o que precisam fazer e o que vão ganhar.",
                initials: "C",
                color: "from-blue-500 to-cyan-500",
                result: "3 filhos, zero discussão sobre tarefas",
              },
              {
                name: "Mariana S.",
                city: "Curitiba, PR",
                role: "Mãe de 1 filho (8 anos)",
                quote: "Meu filho é viciado em jogos. Quando mostrei o KidsTasks, ele falou 'isso é um RPG de verdade!'. Em um mês ele estava completando tarefas que eu nunca consegui fazer ele fazer antes.",
                initials: "M",
                color: "from-emerald-500 to-teal-500",
                result: "Filho apelida de 'RPG da vida real'",
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
          PREÇOS — Pricing com urgência e âncora
          Gatilho: Ancoragem + Escassez + Reciprocidade
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
              Menos que uma pizza.<br />
              <span style={{ color: "#7c3aed" }}>Resultado que dura anos.</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Por menos de R$0,33 por dia, você transforma a rotina de toda a sua família.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-7">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Gratuito</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-gray-900">R$0</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Para sempre, sem cartão</p>
              <ul className="space-y-3 mb-8">
                {[
                  "1 filho cadastrado",
                  "5 tarefas ativas",
                  "Carteira financeira básica",
                  "Gamificação: pontos e níveis",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-600 text-sm">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {["Filhos ilimitados", "Poupança com metas", "Loja de recompensas", "Badges e conquistas"].map((f) => (
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
                  "Até 5 filhos cadastrados",
                  "Tarefas ilimitadas com recorrência",
                  "Carteira financeira completa",
                  "Poupança com metas por filho",
                  "Loja de pontos e resgates",
                  "Badges e metas especiais",
                  "Co-responsáveis (editor e leitor)",
                  "Impressão de relatório de tarefas",
                  "Suporte por e-mail",
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
                <span className="text-emerald-600 font-bold">R$9,90/mês</span>
              </p>
              <p className="text-gray-300 text-xs mb-6">2 meses grátis inclusos</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Até 5 filhos cadastrados",
                  "Tarefas ilimitadas com recorrência",
                  "Carteira financeira completa",
                  "Poupança com metas por filho",
                  "Loja de pontos e resgates",
                  "Badges e metas especiais",
                  "Co-responsáveis (editor e leitor)",
                  "Impressão de relatório de tarefas",
                  "Suporte por e-mail",
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
          GARANTIA — Inversão de risco
          Gatilho: Remoção do risco + Confiança
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-green-200 bg-green-50">
            <div className="text-6xl">🛡️</div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              Garantia de 30 dias — sem perguntas.
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-lg">
              Se em 30 dias você não ver uma melhora real na rotina da sua família, devolvemos 100% do seu dinheiro. Sem burocracia, sem questionamentos. Confiamos nos nossos resultados.
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
          FAQ — Quebra de objeções
          Gatilho: Clareza + Remoção de barreiras
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
                a: "Sim! O KidsTasks foi desenvolvido para crianças a partir de 5 anos. A interface do filho é simples, visual e com emojis. Para os menores, os pais gerenciam as tarefas e mostram os resultados juntos.",
              },
              {
                q: "Funciona com filhos que não têm smartphone?",
                a: "Perfeitamente. Os pais gerenciam tudo pelo navegador ou celular. A aprovação de tarefas fica na mão de quem tem o dispositivo — basta o filho avisar que concluiu.",
              },
              {
                q: "E se eu quiser cancelar?",
                a: "Cancele quando quiser, direto no painel, em menos de 1 minuto. Sem multa, sem burocracia. Seus dados ficam disponíveis por 30 dias após o cancelamento.",
              },
              {
                q: "O sistema é seguro? Meus dados ficam protegidos?",
                a: "Sim. Usamos criptografia SSL, os dados ficam em servidores no Brasil e seguimos rigorosamente a LGPD. Nunca vendemos ou compartilhamos dados da sua família.",
              },
              {
                q: "Posso usar em família com filhos de idades bem diferentes?",
                a: "Absolutamente. Você configura tarefas e dificuldades individualmente por filho. Um de 7 anos tem missões diferentes do de 13 anos — cada um no seu ritmo.",
              },
              {
                q: "Como funciona o plano gratuito?",
                a: "O plano gratuito é para sempre, sem trial. Você pode adicionar 1 filho com até 5 tarefas. Quando quiser expandir para mais filhos, tarefas ilimitadas e a loja de recompensas, basta fazer upgrade.",
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
          CTA FINAL — Fechamento
          Gatilho: Urgência + Reciprocidade + Transformação
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
            Comece hoje.
            <br />
            <span style={{
              background: "linear-gradient(90deg, #fbbf24, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Veja a mudança em 30 dias.
            </span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Cada dia que passa sem um sistema é um dia de hábitos ruins sendo formados. Sua família merece harmonia. Seus filhos merecem estrutura. Você merece paz.
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
                <Image src="/logo.png" alt="KidsTasks" width={36} height={36} className="rounded-lg" />
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
