import { CreateReviewRequest } from "@/types/request.types";
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

const ReviewContext = createContext<{
  reviewBody: string;
  setReviewBody: Dispatch<SetStateAction<string>>;
  reviewType: CreateReviewRequest["event"];
  setReviewType: Dispatch<SetStateAction<CreateReviewRequest["event"]>>;
  resetKey: number;
  resetReview: () => void;
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
  const [reviewType, setReviewType] = useState<CreateReviewRequest["event"]>("COMMENT");
  const [resetKey, setResetKey] = useState(0);

  const resetReview = () => {
    setReviewBody("");
    setReviewType("COMMENT");
    setResetKey((key) => key + 1);
  };

  return (
    <ReviewContext
      value={{
        reviewBody,
        setReviewBody,
        reviewType,
        setReviewType,
        resetKey,
        resetReview,
      }}
    >
      {children}
    </ReviewContext>
  );
}
