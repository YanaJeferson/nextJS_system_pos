"use client";
import { useForm } from "react-hook-form";
import { useApi } from "@/hooks/use-api";
import { CInput } from "@/components/custom/c-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

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
  const locale = useLocale();
  const login = usePost<{
    user: { id: number; name: string; email: string; role: string };
  }>("/api/auth/login", {
    onSuccess: () => router.push(`/${locale}/dashboard`),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <CInput
          label={t("email")}
          type="email"
          error={formState.errors.email}
          {...register("email", { required: "Campo requerido" })}
        />
        <CInput
          label={t("password")}
          type="password"
          error={formState.errors.password}
          {...register("password", { required: "Campo requerido" })}
        />
        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Ingresando..." : t("login")}
        </Button>
        {login.isError && (
          <p className="text-red-500 text-sm">
            {(login.error as any)?.message || "Error al ingresar"}
          </p>
        )}
      </form>
    </div>
  );
}
