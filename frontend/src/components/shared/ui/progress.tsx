import * as React from "react";
import { cn } from "@/lib/utils";

const ProgressBar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: number; max?: number }
>(({ className, value, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div
            ref={ref}
            className={cn("relative h-2.5 w-full rounded-full bg-secondary", className)}
            {...props}
        >
            <div
                className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    percentage >= 100
                        ? "bg-success"
                        : percentage >= 50
                            ? "bg-primary"
                            : "bg-warning"
                )}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
});
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
