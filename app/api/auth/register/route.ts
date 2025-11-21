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
    const { name, email, password } = body || {}

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const exists = await query<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS exists",
      [email]
    )

    if (exists.rows[0]?.exists) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 409 })
    }

    const inserted = await query<{
      id: number
      name: string
      email: string
      role: string
    }>(
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, password]
    )

    const user = inserted.rows[0]
    return NextResponse.json({ user }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}