import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";

export interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 2,
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={{
        "--duration": "30s",
        "--gap": "1rem",
        ...style,
      } as React.CSSProperties}
      className={cn(
        "group flex overflow-hidden p-2 [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical && !reverse,
              "animate-marquee-reverse flex-row": !vertical && reverse,
              "animate-marquee-vertical flex-col": vertical,
              "marquee-pause-on-hover": pauseOnHover,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
