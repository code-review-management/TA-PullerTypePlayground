"use client";

import { ReactNode } from "react";
import MergeContextProvider from "./_contexts/MergeContext";
import ReviewContextProvider from "./_contexts/ReviewContext";

export default function PullLayout({ children }: { children: ReactNode }) {
  return (
    <MergeContextProvider>
      <ReviewContextProvider>{children}</ReviewContextProvider>
    </MergeContextProvider>
  );
}
