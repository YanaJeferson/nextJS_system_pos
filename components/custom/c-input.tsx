import React, { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "../ui/label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: FieldError;
  rightElement?: React.ReactNode;
}

export function CInput({
  label,
  icon,
  error,
  rightElement,
  ...rest
}: InputProps) {
  const { className, ...inputProps } = rest;
  const paddingRightClass = rightElement ? "pr-10" : "";
  const paddingLeftClass = icon ? "pl-9" : "";
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <Label>{label}</Label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <UIInput
          {...inputProps}
          className={`${
            error ? "border-red-500" : ""
          } ${paddingRightClass} ${paddingLeftClass} ${className ?? ""}`}
        />
        {rightElement && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
