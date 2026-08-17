import { cn } from "@/lib/utils";

export function StackCard({
  children,
  z,
  tone = "canvas",
  className,
}: {
  children: React.ReactNode;
  z: number;
  tone?: "canvas" | "canvas-2";
  className?: string;
}) {
  return (
    <div data-stack-page="" className="relative" style={{ zIndex: z }}>
      <div
        data-stack-surface=""
        className={cn(
          "relative rounded-t-(--stack-radius) shadow-(--stack-shadow)",
          tone === "canvas-2" ? "bg-canvas-2" : "bg-canvas",
          className,
        )}
      >
        <div className="overflow-hidden rounded-[inherit]">{children}</div>
      </div>
    </div>
  );
}
