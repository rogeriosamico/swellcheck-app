import { Toaster as Sonner } from "sonner";

const Toaster = (props) => (
  <Sonner
    theme="light"
    position="top-center"
    duration={3000}
    toastOptions={{
      style: {
        background: "var(--surface-secondary)",
        color: "var(--text-invert)",
        borderRadius: "var(--radius-minimal)",
        padding: "var(--spacing-sm) var(--spacing-md)",
        fontSize: "var(--font-size-body)",
        fontWeight: "var(--font-weight-bold)",
        fontFamily: "var(--font-family)",
        border: "none",
        boxShadow: "none",
        gap: "var(--spacing-sm)",
      },
    }}
    {...props}
  />
);

export { Toaster };
