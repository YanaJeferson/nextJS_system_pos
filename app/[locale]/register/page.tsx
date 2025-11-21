"use client"
import { useForm } from "react-hook-form"
import { useApi } from "@/hooks/use-api"
import { CInput } from "@/components/custom/c-input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const { register, handleSubmit, formState } = useForm<{ name: string; email: string; password: string }>({
    defaultValues: { name: "", email: "", password: "" },
  })
  const { usePost } = useApi({})
  const router = useRouter()
  const t = useTranslations("register")
  const tAuth = useTranslations("auth")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const createUser = usePost<{ user: { id: number; name: string; email: string; role: string } }>(
    "/api/auth/register",
    {
      onSuccess: () => router.push(`/${locale}/auth`),
    }
  )

  const onSubmit = (data: { name: string; email: string; password: string }) => {
    createUser.mutate(data)
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-xl font-semibold tracking-tight">{t("title")}</p>

          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="text-sm px-2">{tAuth("or")}</span>
            <Separator />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <CInput
              label={t("name")}
              type="text"
              placeholder={t("name")}
              error={formState.errors.name}
              icon={<User size={16} />}
              {...register("name", { required: tCommon("required") })}
            />
            <CInput
              label={t("email")}
              type="email"
              placeholder={t("email")}
              error={formState.errors.email}
              icon={<Mail size={16} />}
              {...register("email", { required: tCommon("required") })}
            />
            <CInput
              label={t("password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              error={formState.errors.password}
              icon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground"
                  aria-label={showPassword ? tAuth("hidePassword") : tAuth("showPassword")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("password", { required: tCommon("required") })}
            />
            <Button type="submit" className="mt-4 w-full" disabled={createUser.isPending}>
              {createUser.isPending ? t("loading") : t("create")}
            </Button>
          </form>

          {createUser.isError && (
            <p className="text-red-500 text-sm mt-3">
              {(createUser.error as any)?.message || t("error")}
            </p>
          )}

          <div className="mt-5 space-y-5 w-full">
            <p className="text-sm text-center">
              {t("haveAccount")}
              <Link href={`/${locale}/auth`} className="ml-1 underline text-muted-foreground">
                {tAuth("login")}
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block rounded-lg border" />
      </div>
    </div>
  )
}