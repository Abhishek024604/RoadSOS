import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roadsos disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-roadsos text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
        secondary: "bg-emerald-500 text-white hover:bg-emerald-600",
        outline: "border border-blue-200 bg-white text-roadsos hover:bg-blue-50",
        subtle: "bg-slate-100 text-ink hover:bg-slate-200",
        ghost: "text-ink hover:bg-slate-100",
        ghostIcon: "grid h-11 w-11 place-items-center rounded-full bg-white p-0 text-ink shadow-sm ring-1 ring-line hover:bg-slate-50"
      },
      size: {
        default: "h-11 px-4",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export function Button({ variant, size, asChild = false, className, children, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  );
}
