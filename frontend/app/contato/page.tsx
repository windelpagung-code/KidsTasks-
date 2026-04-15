"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ContatoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Abre o cliente de e-mail com os dados preenchidos
    const mailto = `mailto:suporte@kidstasks.com.br?subject=${encodeURIComponent(form.subject || "Contato via site")}&body=${encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
  }

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

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">
              💬 Fale conosco
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-3">Estamos aqui para ajudar</h1>
            <p className="text-gray-500 text-lg">Dúvidas, sugestões ou suporte — respondemos em até 24 horas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulário */}
            <div>
              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-xl font-bold text-emerald-800 mb-2">Mensagem enviada!</h2>
                  <p className="text-emerald-600 text-sm">Abrimos seu cliente de e-mail com a mensagem. Responderemos em até 24 horas.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm text-emerald-700 underline">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assunto</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Dúvida sobre o produto">Dúvida sobre o produto</option>
                      <option value="Suporte técnico">Suporte técnico</option>
                      <option value="Cancelamento de assinatura">Cancelamento de assinatura</option>
                      <option value="Parceria ou imprensa">Parceria ou imprensa</option>
                      <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mensagem</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Descreva sua dúvida ou mensagem..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                  >
                    Enviar mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Contatos diretos */}
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">E-mail</p>
                    <p className="text-gray-500 text-sm mt-0.5">suporte@kidstasks.com.br</p>
                    <p className="text-gray-400 text-xs mt-1">Respondemos em até 24 horas úteis</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
                    <p className="text-gray-500 text-sm mt-0.5">Disponível no plano Pro e Família</p>
                    <p className="text-gray-400 text-xs mt-1">Acesse pelo painel após fazer login</p>
                  </div>
                </div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Horário de atendimento</p>
                    <p className="text-gray-500 text-sm mt-0.5">Segunda a sexta, das 9h às 18h</p>
                    <p className="text-gray-400 text-xs mt-1">Horário de Brasília (BRT)</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Localização</p>
                    <p className="text-gray-500 text-sm mt-0.5">Brasil 🇧🇷</p>
                    <p className="text-gray-400 text-xs mt-1">Dados armazenados em servidores no Brasil, em conformidade com a LGPD</p>
                  </div>
                </div>
              </div>
            </div>
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
