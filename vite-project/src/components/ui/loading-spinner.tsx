// File: src/components/ui/loading-spinner.tsx
import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingSpinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        small: "h-4 w-4",
        default: "h-6 w-6", 
        large: "h-8 w-8",
        xl: "h-12 w-12"
      },
      variant: {
        default: "text-primary",
        destructive: "text-destructive",
        outline: "text-muted-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-muted-foreground",
        link: "text-primary",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<SVGElement>,
    VariantProps<typeof loadingSpinnerVariants> {}

const LoadingSpinner = React.forwardRef<
  SVGSVGElement,
  LoadingSpinnerProps
>(({ className, size, variant, ...props }, ref) => {
  return (
    <Loader2
      ref={ref}
      className={cn(loadingSpinnerVariants({ size, variant, className }))}
      {...props}
    />
  )
})
LoadingSpinner.displayName = "LoadingSpinner"

// Loading Button Component
export interface LoadingButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const LoadingButton = React.forwardRef<
  HTMLButtonElement, 
  LoadingButtonProps
>(({ loading = false, children, className, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="small" className="mr-2" />}
      {children}
    </button>
  )
})
LoadingButton.displayName = "LoadingButton"

// Loading Overlay Component
export interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  className?: string
  message?: string
}

const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(({ loading, children, className, message = "Loading..." }, ref) => {
  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="large" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
})
LoadingOverlay.displayName = "LoadingOverlay"

export { LoadingSpinner, LoadingButton, LoadingOverlay, loadingSpinnerVariants }