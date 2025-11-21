"use client";
import { useForm } from "react-hook-form";
import { useApi } from "@/hooks/use-api";
import { CInput } from "@/components/custom/c-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: { email: "", password: "" },
  });
  const { usePost } = useApi({});
  const router = useRouter();
  const t = useTranslations("auth");
  const tRegister = useTranslations("register");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const login = usePost<{
    user: { id: number; name: string; email: string; role: string };
  }>("/api/auth/login", {
    onSuccess: () => router.push(`/${locale}/dashboard`),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    login.mutate(data);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full h-full grid lg:grid-cols-2 p-4">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-xl font-semibold tracking-tight">
            {t("title")}
          </p>

          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="text-sm px-2">{t("or")}</span>
            <Separator />
          </div>

          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <CInput
              label={t("email")}
              type="email"
              placeholder={t("email")}
              error={formState.errors.email}
              icon={<Mail size={16} />}
              {...register("email", { required: "Required field" })}
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
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("password", { required: "Required field" })}
            />
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={login.isPending}
            >
              {login.isPending ? t("loading") : t("login")}
            </Button>
          </form>

          {login.isError && (
            <p className="text-red-500 text-sm mt-3">
              {(login.error as any)?.message || "Error signing in"}
            </p>
          )}

          <div className="mt-5 space-y-5 w-full">
            <Link href={`/${locale}/forgot-password`} className="text-sm block underline text-muted-foreground text-center">
              {t("forgot")}
            </Link>
            <p className="text-sm text-center">
              {t("noAccount")}
              <Link
                href={`/${locale}/register`}
                className="ml-1 underline text-muted-foreground"
              >
                {tRegister("create")}
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block rounded-lg border" />
      </div>
    </div>
  );
}
