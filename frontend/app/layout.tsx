import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import InstallPrompt from "./components/InstallPrompt";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KidsTasks — Mesada Gamificada para Famílias",
  description: "Transforme a rotina da sua família e crie filhos mais responsáveis com gamificação de tarefas e mesada inteligente.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "KidsTasks — Mesada Gamificada para Famílias",
    description: "Transforme a rotina da sua família e crie filhos mais responsáveis com gamificação de tarefas e mesada inteligente.",
    url: "https://kidstasks1.vercel.app",
    siteName: "KidsTasks",
    images: [
      {
        url: "https://kidstasks1.vercel.app/logo.png",
        width: 500,
        height: 500,
        alt: "KidsTasks",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KidsTasks — Mesada Gamificada para Famílias",
    description: "Transforme a rotina da sua família e crie filhos mais responsáveis com gamificação de tarefas e mesada inteligente.",
    images: ["https://kidstasks1.vercel.app/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">
        {children}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
