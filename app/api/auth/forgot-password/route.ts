import { NextResponse } from "next/server"
import { query } from "@/lib/db/client"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, locale } = body || {}

    if (!email) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const result = await query<{ id: number }>(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    )

    const user = result.rows[0]

    if (user) {
      await query(
        "CREATE TABLE IF NOT EXISTS password_resets (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, token TEXT NOT NULL, expires_at TIMESTAMP NOT NULL)"
      )
      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      await query(
        "INSERT INTO password_resets(user_id, token, expires_at) VALUES ($1, $2, $3)",
        [user.id, token, expiresAt]
      )

      const host = req.headers.get("host") || "localhost:3000"
      const baseUrl = `http://${host}`
      const pathLocale = locale ? `/${locale}` : ""
      const resetUrl = `${baseUrl}${pathLocale}/reset-password?token=${token}`

      if (process.env.RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            text: `We received a request to reset your password. If this was you, click the link: ${resetUrl}`,
          }),
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}