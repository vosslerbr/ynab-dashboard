import { H1 } from "@/components/ui/typography";
import type { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageTitle({ title, subtitle, children }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <H1>{title}</H1>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
