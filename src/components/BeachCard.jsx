import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BeachCard = React.forwardRef(({
  className,
  name,
  state,
  country,
  height,
  condition,
  label,
  onClick,
  ...props
}, ref) => (
  <Card
    ref={ref}
    className={cn("p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--surface-terciary)] transition-colors", className)}
    onClick={onClick}
    {...props}
  >
    <div className="flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <div className="text-headline font-token-bold text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>
        <div className="text-subtitle text-[var(--text-secondary)] mt-[var(--spacing-xs)]">
          {state}, {country}
        </div>
      </div>

      <Badge variant={condition}>{label}</Badge>
    </div>
  </Card>
));
BeachCard.displayName = "BeachCard";

export default BeachCard;
