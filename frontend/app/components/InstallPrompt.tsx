"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [iosPrompt, setIosPrompt] = useState(false);
  const [androidPrompt, setAndroidPrompt] = useState(false);
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-prompt-dismissed")) return;

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = window.matchMedia("(display-mode: standalone)").matches
      || ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone);

    if (isIos && !isInStandalone) {
      // Show iOS instructions after 3 seconds
      const t = setTimeout(() => setIosPrompt(true), 3000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setAndroidPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setIosPrompt(false);
    setAndroidPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", "1");
  }

  async function handleAndroidInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    if (outcome === "accepted") setAndroidPrompt(false);
  }

  if (dismissed) return null;

  // ── Android / Desktop: install button ──────────────────────
  if (androidPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80 animate-in slide-in-from-bottom-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
          <img src="/icon-192.png" alt="KidsTasks" className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Instalar KidsTasks</p>
            <p className="text-xs text-gray-500">Adicione à tela inicial para acesso rápido</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleAndroidInstall}
              className="px-3 py-1.5 rounded-xl text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              Instalar
            </button>
            <button onClick={dismiss} className="text-xs text-gray-400 hover:text-gray-600 text-center">
              Agora não
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── iOS Safari: step-by-step instructions ──────────────────
  if (iosPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-4">
            <img src="/icon-192.png" alt="KidsTasks" className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm">Adicionar à Tela Inicial</p>
              <p className="text-xs text-gray-500">Use como um app nativo no seu iPhone</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-600">1</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Toque no botão <span className="font-semibold">Compartilhar</span>
                  {" "}<span className="inline-block align-middle text-base">⎙</span>
                  {" "}na barra inferior do Safari
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-600">2</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Role para baixo e toque em{" "}
                  <span className="font-semibold">"Adicionar à Tela Inicial"</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-600">3</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Toque em <span className="font-semibold">"Adicionar"</span> no canto superior direito</p>
              </div>
            </div>
          </div>

          {/* Arrow pointing down to Safari share button */}
          <div className="flex flex-col items-center mb-4">
            <div className="text-2xl animate-bounce">↓</div>
            <p className="text-xs text-gray-400">Botão compartilhar fica aqui embaixo</p>
          </div>

          <button
            onClick={dismiss}
            className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition"
          >
            Ok, entendi!
          </button>
        </div>
      </div>
    );
  }

  return null;
}
