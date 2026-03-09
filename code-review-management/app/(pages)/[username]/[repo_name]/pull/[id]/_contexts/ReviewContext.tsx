import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

/**
 * Docs:
 * 1. https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#without-default-context-value
 */

export type ReviewType = "approve" | "comment" | "request-changes" | null;

const ReviewContext = createContext<{
  reviewBody: string;
  setReviewBody: Dispatch<SetStateAction<string>>;
  reviewType: ReviewType;
  setReviewType: Dispatch<SetStateAction<ReviewType>>;
} | null>(null);

export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviewContext has to be used within <ReviewContext>");
  }
  return context;
};

export default function ReviewContextProvider({
  children,
}: {
  children: ReactNode;
}) {
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
