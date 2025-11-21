import {getRequestConfig} from "next-intl/server"

export const locales = ["en", "es"] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = "es"

export default getRequestConfig(async () => {
  const selected = defaultLocale
  const messages = (await import(`./messages/${selected}.json`)).default
  return { locale: selected, messages }
})