import { cn } from "@/lib/utils"
import { Swirling } from "@/components/loading-ui/swirling"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Swirling data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4", className)} {...props} />
  )
}

export { Spinner, Swirling }
