import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-minimal)] border-0 px-[var(--spacing-sm)] py-[var(--spacing-xs)] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground",
        outline: "text-foreground border border-border",
        storm: "bg-[var(--surface-storm-gradient)] text-[var(--text-storm)]",
        bom: "bg-[var(--surface-bom-gradient)] text-[var(--text-bom)]",
        marola: "bg-[var(--surface-marola-gradient)] text-[var(--text-marola)]",
        flat: "bg-[var(--surface-flat-gradient)] text-[var(--text-flat)]",
      },
      size: {
        default: "",
        small: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const sizeTextClass = {
  default: "text-token-body-bold",
  small: "text-token-subtitle-bold",
};

function Badge({
  className,
  variant,
  size = "default",
  ...props
}) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      <span className={sizeTextClass[size]}>
        {props.children}
      </span>
    </div>
  );
}

export { Badge, badgeVariants }
