import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "~/lib/utils";

interface TextareaProps {
  placeholder: string;
  className?: string;
  registerField: UseFormRegisterReturn;
  defaultValue?: string;

}
const Textarea = (props: TextareaProps) => {
  const { placeholder, className, registerField, defaultValue } = props;
  return (
    <div
      className={cn(
        "bg-input-bg inline-flex w-full rounded-[8px] px-[18px] py-3 ",
        className,
      )}
    >
      <textarea
        {...registerField}
        {...(defaultValue ? { defaultValue } : {})}
        rows={4}
        className="placeholder:text-input-placeholder text-white ml-2 flex-1 bg-transparent font-[350px] outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textarea;
