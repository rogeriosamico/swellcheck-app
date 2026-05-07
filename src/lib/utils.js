import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-title',
        'text-title-sm',
        'text-headline',
        'text-button',
        'text-body',
        'text-subtitle',
      ],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
