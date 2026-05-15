import { createContext, useContext } from "react";
import { ClearHighlightProps } from "../_hooks/useHighlight";

const ClearHighlightContext = createContext<{
  clearHighlight: ({ start, end, side }: ClearHighlightProps) => void;
} | null>(null);

export const useClearHighlightContext = () => {
  const context = useContext(ClearHighlightContext);
  if (!context) {
    throw new Error(
      "useClearHighlightContext has to be used within <ClearHighlightContext>",
    );
  }
  return context;
};

export default ClearHighlightContext;
