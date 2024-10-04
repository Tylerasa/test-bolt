import { LucideIcon } from "lucide-react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "~/lib/utils";

interface InputProps {
  icon?: LucideIcon | null;
  placeholder: string;
  t: string;
  className?: string;
  registerField?: UseFormRegisterReturn;
}
const Input = (props: InputProps) => {
  const {
    icon: Icon,
    placeholder,
    t,
    className,
    registerField,
  } = props;
  return (
    <div
      className={cn(
        "bg-input-bg inline-flex w-full rounded-[8px] px-[18px] py-3 ",
        className,
      )}
    >
      {Icon && <Icon className="h-5 w-5 text-white " />}
      <input
        {...registerField}
        type={t}
        className="placeholder:text-input-placeholder ml-2 flex-1 bg-transparent font-[350px] text-white outline-none"
        placeholder={placeholder}
        {...(t === "number" ? { step: "0.01" } : {})}
      />
    </div>
  );
};

export default Input;
