import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1 w-full grow overflow-hidden rounded-full bg-[var(--border-primary)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--surface-secondary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="relative block h-5 w-5 rounded-full border-2 border-[var(--surface-secondary)] bg-[var(--surface-secondary)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 before:absolute before:-inset-[12px] before:content-['']" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
