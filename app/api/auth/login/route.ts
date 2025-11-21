import { NextResponse } from "next/server"
import { query } from "@/lib/db/client"

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const result = await query<{
      id: number
      name: string
      email: string
      password: string
      role: string
    }>(
      "SELECT id, name, email, password, role FROM users WHERE email = $1 LIMIT 1",
      [email]
    )

    const user = result.rows[0]
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const ok = user.password === password
    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
    res.cookies.set("session", String(user.id), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
export const runtime = "nodejs"
export const dynamic = "force-dynamic"