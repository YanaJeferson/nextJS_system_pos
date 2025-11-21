import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n"

const intl = createMiddleware({ locales, defaultLocale })

export default function proxy(req: NextRequest) {
  const res = intl(req)

  const pathname = req.nextUrl.pathname
  const segments = pathname.split("/").filter(Boolean)
  const locale = segments[0]
  const restPath = `/${segments.slice(1).join("/")}`
  const session = req.cookies.get("session")?.value

  if (restPath.startsWith("/dashboard") && !session) {
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/auth`
    return NextResponse.redirect(url)
  }

  if ((restPath === "/auth" || restPath === "/register") && session) {
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next|api|.*\..*).*)"],
}