import { NextResponse } from "next/server"
import { query } from "@/lib/db/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body || {}

    if (!token || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    await query(
      "CREATE TABLE IF NOT EXISTS password_resets (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, token TEXT NOT NULL, expires_at TIMESTAMP NOT NULL)"
    )

    const reset = await query<{ user_id: number }>(
      "SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW() LIMIT 1",
      [token]
    )

    const row = reset.rows[0]
    if (!row) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    await query("UPDATE users SET password = $1 WHERE id = $2", [password, row.user_id])
    await query("DELETE FROM password_resets WHERE token = $1", [token])

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}