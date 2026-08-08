import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { weekdayAndDateLabel } from "@/lib/dates";

const DayCard = React.forwardRef(({
  className,
  dateIso,
  condition,
  label,
  onClick,
  ...props
}, ref) => {
  const { weekday, date } = weekdayAndDateLabel(dateIso);
  return (
    <Card
      ref={ref}
      className={cn(
        "p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--surface-terciary)] transition-colors min-h-[var(--touch-target)]",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
      aria-label={`${weekday}, ${date}. Condição: ${label}`}
      {...props}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="text-headline font-token-bold text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis">
            {weekday}
          </div>
          <div className="text-subtitle text-[var(--text-secondary)] mt-[var(--spacing-xs)]">
            {date}
          </div>
        </div>

        <Badge variant={condition}>{label}</Badge>
      </div>
    </Card>
  );
});
DayCard.displayName = "DayCard";

export default DayCard;
