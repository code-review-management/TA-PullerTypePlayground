"use client";

import { ReactNode } from "react";
import PermissionContextProvider from "./_contexts/PermissionContext";
import MergeContextProvider from "./_contexts/MergeContext";
import ReviewContextProvider from "./_contexts/ReviewContext";

export default function PullLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionContextProvider>
      <MergeContextProvider>
        <ReviewContextProvider>{children}</ReviewContextProvider>
      </MergeContextProvider>
    </PermissionContextProvider>
  );
}
