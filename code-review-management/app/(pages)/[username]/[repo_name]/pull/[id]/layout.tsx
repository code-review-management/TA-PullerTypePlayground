"use client";

import { ReactNode } from "react";
import ReviewContextProvider from "./_contexts/ReviewContext";

export default function PullLayout({ children }: { children: ReactNode }) {
  return <ReviewContextProvider>{children}</ReviewContextProvider>;
}
