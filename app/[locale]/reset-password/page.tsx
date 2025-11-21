"use client"
import { useForm } from "react-hook-form"
import { useApi } from "@/hooks/use-api"
import { CInput } from "@/components/custom/c-input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState, watch } = useForm<{ password: string; confirm: string }>({
    defaultValues: { password: "", confirm: "" },
  })
  const { usePost } = useApi({})
  const router = useRouter()
  const params = useSearchParams()
  const t = useTranslations("reset")
  const tAuth = useTranslations("auth")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const token = params.get("token") || ""
  const reset = usePost<{}>("/api/auth/reset-password", {
    onSuccess: () => router.push(`/${locale}/auth`),
  })

  const onSubmit = (data: { password: string; confirm: string }) => {
    if (data.password !== data.confirm) return
    reset.mutate({ token, password: data.password } as any)
  }

  const mismatch = watch("password") && watch("confirm") && watch("password") !== watch("confirm")

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-xl font-semibold tracking-tight">{t("title")}</p>
          <p className="mt-2 text-sm text-muted-foreground text-center">{t("description")}</p>

          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="text-sm px-2">{tAuth("or")}</span>
            <Separator />
          </div>

          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            <CInput
              label={t("confirm")}
              type={showConfirm ? "text" : "password"}
              placeholder={t("confirm")}
              error={formState.errors.confirm}
              icon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-muted-foreground"
                  aria-label={showConfirm ? tAuth("hidePassword") : tAuth("showPassword")}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("confirm", { required: tCommon("required") })}
            />
            {mismatch && <p className="text-red-500 text-sm">{t("mismatch")}</p>}
            <Button type="submit" className="mt-4 w-full" disabled={reset.isPending || mismatch || !token}>
              {reset.isPending ? t("loading") : t("update")}
            </Button>
          </form>

          {reset.isSuccess && (
            <p className="text-green-600 text-sm mt-3">{t("success")}</p>
          )}
          {reset.isError && (
            <p className="text-red-500 text-sm mt-3">{t("error")}</p>
          )}

          <div className="mt-5 space-y-5 w-full">
            <p className="text-sm text-center">
              <Link href={`/${locale}/auth`} className="underline text-muted-foreground">
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