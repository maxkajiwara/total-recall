import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-gray-200 placeholder:text-muted-foreground focus:border-primary aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-lg border bg-white px-3 py-2 text-base transition-colors outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
