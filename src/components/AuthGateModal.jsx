import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function AuthGateModal({ open, onClose, onConfirm, title, description, ctaLabel }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-[380px] p-6 gap-0">
        <DialogHeader className="mb-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-2">{description}</DialogDescription>
        </DialogHeader>
        <Button
          onClick={onConfirm}
          className="w-full h-12"
        >
          {ctaLabel}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
