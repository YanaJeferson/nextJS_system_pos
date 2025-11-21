import Link from "next/link"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export default async function DashboardHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const tiles = [
    { href: `/${locale}/dashboard/sales`, title: "Ventas", desc: "Registrar y ver ventas" },
    { href: `/${locale}/dashboard/products`, title: "Productos", desc: "Gestiona catálogo" },
    { href: `/${locale}/dashboard/inventory`, title: "Inventario", desc: "Movimientos y stock" },
    { href: `/${locale}/dashboard/customers`, title: "Clientes", desc: "Listado y búsqueda" },
    { href: `/${locale}/dashboard/suppliers`, title: "Proveedores", desc: "Gestiona proveedores" },
    { href: `/${locale}/dashboard/employees`, title: "Empleados", desc: "Personal y roles" },
    { href: `/${locale}/dashboard/reports`, title: "Reportes", desc: "Resumenes y métricas" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((t) => (
        <Card key={t.href} className="p-4 flex flex-col gap-2">
          <div className="font-medium">{t.title}</div>
          <div className="text-sm text-muted-foreground">{t.desc}</div>
          <Link href={t.href} className={buttonVariants({ variant: "outline" })}>Abrir</Link>
        </Card>
      ))}
    </div>
  )
}