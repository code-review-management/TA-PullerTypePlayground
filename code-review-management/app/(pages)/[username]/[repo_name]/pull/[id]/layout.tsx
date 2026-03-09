"use client";

import { ReactNode, useState } from "react";
import ReviewContext, { ReviewType } from "./_contexts/ReviewContext";

export default function PullLayout({ children }: { children: ReactNode }) {
  const [reviewBody, setReviewBody] = useState("");
  const [reviewType, setReviewType] = useState<ReviewType>("comment");

  return (
    <ReviewContext
      value={{ reviewBody, setReviewBody, reviewType, setReviewType }}
    >
      {children}
    </ReviewContext>
  );
}
