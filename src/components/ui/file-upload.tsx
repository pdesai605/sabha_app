"use client";

import * as React from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  value = [],
  onChange,
  disabled = false,
  className,
  hint = "Drag and drop files here, or click to browse",
}: FileUploadProps) {
  const lt = useLocaleText();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    let files = Array.from(fileList);
    if (maxSize) {
      files = files.filter((f) => f.size <= maxSize);
    }
    onChange?.(multiple ? [...value, ...files] : files.slice(0, 1));
  };

  const removeFile = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-border-default bg-background-muted/30 px-6 py-10 transition-colors cursor-pointer",
          isDragging && "border-accent-primary/40 bg-accent-primary-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:border-border-default hover:bg-background-muted/50"
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-input bg-background-secondary border border-border-default">
          <Upload className="size-5 text-text-muted" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">{lt(hint)}</p>
          {accept && (
            <p className="text-xs text-text-muted mt-1">
              Accepted: {accept}
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-input border border-border-default bg-background-secondary px-3 py-2"
            >
              <File className="size-4 shrink-0 text-text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text-primary">{file.name}</p>
                <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
