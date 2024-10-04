import React, { useState, useCallback, useEffect } from "react";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FilePreview {
  url: string;
  name: string;
  file?: File;
  isDefault?: boolean;
}

interface InputProps {
  id: string;
  label: string;
  className?: string;
  multiple?: boolean;
  registerField: UseFormRegisterReturn;
  defaultImages?: string[];
}

const FileUpload = (props: InputProps) => {
  const {
    id,
    label,
    className,
    multiple = false,
    registerField,
    defaultImages = [],
  } = props;
  const [previews, setPreviews] = useState<FilePreview[]>([]);

  useEffect(() => {
    if (defaultImages.length > 0) {
      const initialPreviews = defaultImages.map((url) => ({
        url,
        name: url?.split("/").pop() || "Image",
        isDefault: true,
      }));
      setPreviews(initialPreviews);
    }
  }, [defaultImages, registerField]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("gwlll");
      const files = Array.from(event.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (files.length !== imageFiles.length) {
        alert("Please upload only image files");
      }

      const newPreviews = imageFiles.map((file) => {
        return new Promise<FilePreview>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              name: file.name,
              file: file,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then((results) => {
        setPreviews((prev) => {
          // Keep default images and add new ones
          const defaultPreviews = prev.filter((p) => p.isDefault);
          return [...defaultPreviews, ...results];
        });
      });
    },
    [],
  );

  const removeImage = useCallback(
    (indexToRemove: number) => {
      setPreviews((prev) => {
        const updatedPreviews = prev.filter(
          (_, index) => index !== indexToRemove,
        );

        const currentValue = updatedPreviews
          .map((preview) => (preview.isDefault ? preview.url : preview.file))
          .filter(Boolean);

        const event = new Event("input", { bubbles: true });
        const inputElement = document.getElementById(id) as HTMLInputElement;
        if (inputElement) {
          Object.defineProperty(event, "target", {
            writable: false,
            value: {
              value: currentValue,
              id: id,
            },
          });
          inputElement.dispatchEvent(event);
        }

        return updatedPreviews;
      });
    },
    [id],
  );

  return (
    <div
      className={cn(
        "bg-input-bg block w-full rounded-[8px] px-[18px] py-3",
        className,
      )}
    >
      <label
        htmlFor={id}
        className={`${
          !!defaultImages
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer  opacity-100"
        } `}
      >
        <span className="mt-[6px] text-sm text-[#FFFFFFCC]">{label}</span>
        <br />
        <span
          className={`w-[157px] rounded-[4px] bg-[#F5F5F5] px-4 py-1 text-sm text-black ${
            !!defaultImages ? "opacity-50" : "opacity-100"
          }`}
        >
          Select file
        </span>
      </label>
      <br />
      {previews.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview.url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full rounded-md object-contain"
              />
              {defaultImages.length > 0 ? (
                <></>
              ) : (
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <p className="mt-1 truncate text-xs text-[#FFFFFFCC]">
                {preview.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-[6px] text-sm text-[#FFFFFFCC]">No files</p>
      )}

      <input
        disabled={!!defaultImages}
        id={id}
        type="file"
        accept="image/*"
        {...registerField}
        onChange={(e) => {
          registerField.onChange(e);
          handleFileChange(e);
        }}
        multiple={multiple}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
