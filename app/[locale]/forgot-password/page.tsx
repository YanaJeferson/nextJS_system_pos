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
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  })
  const { usePost } = useApi({})
  const router = useRouter()
  const t = useTranslations("forgot")
  const tAuth = useTranslations("auth")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const send = usePost<{}>("/api/auth/forgot-password", {
    onSuccess: () => {},
  })

  const onSubmit = (data: { email: string }) => {
    send.mutate({ ...data, locale } as any)
  }

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
              label={t("email")}
              type="email"
              placeholder={t("email")}
              error={formState.errors.email}
              icon={<Mail size={16} />}
              {...register("email", { required: tCommon("required") })}
            />
            <Button type="submit" className="mt-4 w-full" disabled={send.isPending}>
              {send.isPending ? t("loading") : t("send")}
            </Button>
          </form>

          {send.isSuccess && (
            <p className="text-green-600 text-sm mt-3">{t("success")}</p>
          )}
          {send.isError && (
            <p className="text-red-500 text-sm mt-3">{t("error")}</p>
          )}

          <div className="mt-5 space-y-5 w-full">
            <p className="text-sm text-center">
              {tAuth("noAccount")}
              <Link href={`/${locale}/register`} className="ml-1 underline text-muted-foreground">
                {useTranslations("register")("create")}
              </Link>
            </p>
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