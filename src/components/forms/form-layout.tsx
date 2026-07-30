"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  description,
  error,
  children,
  className,
}: FormFieldProps) {
  const lt = useLocaleText();
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {lt(label)}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-text-muted">{lt(description)}</p>
      )}
      {error && (
        <p className="text-xs text-semantic-danger" role="alert">
          {lt(error)}
        </p>
      )}
    </div>
  );
}

export interface FormLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FormLayout({ children, footer, className }: FormLayoutProps) {
  return (
    <div className={cn("relative flex flex-col min-h-0", className)}>
      <div className="flex-1 overflow-y-auto pb-24">{children}</div>
      {footer && (
        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-6 border-t border-border-default bg-background-secondary/95 backdrop-blur-sm px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-base font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("md:col-span-2", className)}>{children}</div>
  );
}

export function FormActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}
