import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — KidsTasks",
  description: "Dicas de educação financeira, rotina familiar e desenvolvimento infantil para pais modernos.",
  openGraph: {
    title: "Blog KidsTasks — Família mais inteligente, filhos mais felizes",
    description: "Artigos sobre educação financeira infantil, mesada, gamificação e desenvolvimento de responsabilidade.",
    type: "website",
  },
};

const posts = [
  {
    slug: "como-ensinar-valor-do-dinheiro",
    tag: "Educação financeira",
    title: "Como ensinar o valor do dinheiro para crianças de 6 a 12 anos",
    excerpt: "Crianças que aprendem sobre dinheiro cedo desenvolvem hábitos financeiros mais saudáveis na vida adulta. Veja como tornar esse aprendizado divertido e eficaz.",
    readTime: "8 min",
    date: "10 abr 2025",
    emoji: "💰",
    featured: true,
  },
  {
    slug: "tarefas-domesticas-por-idade",
    tag: "Rotina familiar",
    title: "Tarefas domésticas por faixa etária: o guia completo para pais",
    excerpt: "Saber quais tarefas são adequadas para cada idade é essencial. Confira o guia com responsabilidades por faixa etária e dicas para implementar sem conflitos.",
    readTime: "7 min",
    date: "02 abr 2025",
    emoji: "🏠",
    featured: false,
  },
  {
    slug: "gamificacao-vs-punicao",
    tag: "Gamificação",
    title: "Por que a gamificação funciona melhor do que punição na educação dos filhos",
    excerpt: "A ciência comprova: recompensas positivas são mais eficazes do que castigos. Entenda como a gamificação transforma a relação dos filhos com responsabilidades.",
    readTime: "9 min",
    date: "25 mar 2025",
    emoji: "🎮",
    featured: false,
  },
  {
    slug: "mesada-quanto-dar-e-como-estruturar",
    tag: "Mesada",
    title: "Mesada para filhos: quanto dar, como estruturar e o que evitar",
    excerpt: "Não existe um valor certo — mas existe uma estrutura certa. Descubra como organizar a mesada do seu filho de forma que ela realmente ensine o valor do dinheiro.",
    readTime: "8 min",
    date: "18 mar 2025",
    emoji: "🪙",
    featured: false,
  },
  {
    slug: "responsabilidade-infantil-sem-pressao",
    tag: "Desenvolvimento",
    title: "Responsabilidade infantil: como desenvolver sem pressão nem conflitos",
    excerpt: "Criar filhos responsáveis exige equilíbrio entre autonomia e limites. Confira estratégias práticas que funcionam na rotina de famílias reais.",
    readTime: "7 min",
    date: "10 mar 2025",
    emoji: "🌱",
    featured: false,
  },
  {
    slug: "metas-poupanca-para-criancas",
    tag: "Poupança",
    title: "Metas de poupança para crianças: como tornar divertido e eficaz",
    excerpt: "Quando a criança tem um objetivo claro, aprender a poupar se torna natural. Veja como definir metas motivadoras e acompanhar o progresso com seus filhos.",
    readTime: "6 min",
    date: "03 mar 2025",
    emoji: "🎯",
    featured: false,
  },
];

const featured = posts.find((p) => p.featured)!;
const rest = posts.filter((p) => !p.featured);

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KidsTasks" width={40} height={40} />
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">KidsTasks</span>
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            Entrar
          </Link>
        </div>
      </header>

      {/* Header */}
      <section className="py-16 px-6 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">
            📚 Blog KidsTasks
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-3">
            Família mais inteligente,<br />filhos mais felizes.
          </h1>
          <p className="text-gray-500 text-lg">
            Artigos práticos sobre educação financeira, rotina familiar e desenvolvimento infantil para pais modernos.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-12 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-5">Artigo em destaque</p>
          <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl h-56 flex items-center justify-center text-7xl">
              {featured.emoji}
            </div>
            <div>
              <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">{featured.tag}</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-3 mb-3 leading-snug group-hover:text-violet-700 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime} de leitura</span>
              </div>
              <p className="mt-4 text-sm font-bold text-violet-600 group-hover:text-violet-800 transition-colors">Ler artigo completo →</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Outros artigos */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-7">Todos os artigos</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 h-36 flex items-center justify-center text-5xl">
                  {post.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">{post.tag}</span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-violet-700 transition-colors">{post.title}</h2>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs font-bold text-violet-600 group-hover:text-violet-800 transition-colors">Ler artigo →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 px-6 bg-gradient-to-br from-violet-50 to-indigo-50 border-t border-violet-100">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-3xl mb-4">✉️</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Receba novos artigos</h2>
          <p className="text-gray-500 text-sm mb-6">Uma vez por semana, dicas práticas sobre educação familiar direto na sua caixa de entrada.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
            <button className="px-5 py-3 rounded-xl text-white text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              Assinar
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <span>© {new Date().getFullYear()} KidsTasks. Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}
