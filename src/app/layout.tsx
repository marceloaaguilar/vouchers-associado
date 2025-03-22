import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exclusive Pass - Área do Associado",
  description: "Exclusive Pass - Área do Associado",
};


export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="pt">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
