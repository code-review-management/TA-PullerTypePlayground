"use client";

import { ReactNode } from "react";
import CommitPickerProvider from "./_contexts/CommitPickerContext";
import MergeContextProvider from "./_contexts/MergeContext";
import ReviewContextProvider from "./_contexts/ReviewContext";
import ProtectedLayout from "@components/ProtectedLayout/ProtectedLayout";

export default function PullLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout>
      <CommitPickerProvider>
        <MergeContextProvider>
          <ReviewContextProvider>{children}</ReviewContextProvider>
        </MergeContextProvider>
      </CommitPickerProvider>
    </ProtectedLayout>
  );
}
