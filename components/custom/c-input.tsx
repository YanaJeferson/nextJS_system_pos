import React, { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "../ui/label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // texto del label
  icon?: React.ReactNode; // icono opcional (sin incluir iconos en el código)
  error?: FieldError; // error de react-hook-form
}

export function CInput({ label, icon, error, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* etiqueta del input */}
      {label && <Label>{label}</Label>}

      <div
        className={`flex items-center gap-2 border rounded px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {/* icono opcional */}
        {icon && <span>{icon}</span>}

        {/* input principal */}
        <UIInput className="flex-1 outline-none bg-transparent" {...rest} />
      </div>

      {/* mensaje de error */}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
