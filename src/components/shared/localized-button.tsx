"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useLocaleText } from "@/lib/i18n/locale-text";
import * as React from "react";

/** Button that auto-translates string children for locale demo. */
export function LButton({
  children,
  ...props
}: ButtonProps) {
  const lt = useLocaleText();
  const content = React.Children.map(children, (child) =>
    typeof child === "string" ? lt(child) : child
  );
  return <Button {...props}>{content}</Button>;
}
