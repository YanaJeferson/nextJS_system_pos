import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import { ReactQueryProvider } from "@/components/providers/react-query"
import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"
import es from "@/messages/es.json"
import en from "@/messages/en.json"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema POS",
  description: "Point of Sale",
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as any)) notFound()
  const messages = locale === "en" ? en : es

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}