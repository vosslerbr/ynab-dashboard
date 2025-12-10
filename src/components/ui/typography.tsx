import type { ReactNode } from "react";

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function H4({ children }: { children: ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function H5({ children }: { children: ReactNode }) {
  return (
    <h5 className="scroll-m-20 text-base font-semibold tracking-tight">
      {children}
    </h5>
  );
}

export function H6({ children }: { children: ReactNode }) {
  return (
    <h6 className="scroll-m-20 text-sm font-semibold tracking-tight">
      {children}
    </h6>
  );
}
