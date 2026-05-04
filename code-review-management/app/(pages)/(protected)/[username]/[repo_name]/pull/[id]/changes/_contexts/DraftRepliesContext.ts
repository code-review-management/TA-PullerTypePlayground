import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { DraftReplies } from "../_hooks/useDraftReplies";

/**
 * Docs:
 * 1. https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#without-default-context-value
 */
const DraftRepliesContext = createContext<{
  draftReplies: DraftReplies;
  setDraftReplies: Dispatch<SetStateAction<DraftReplies>>;
} | null>(null);

export const useDraftRepliesContext = () => {
  const context = useContext(DraftRepliesContext);
  if (!context) {
    throw new Error(
      "useDraftRepliesContext has to be used within <DraftRepliesContext>",
    );
  }
  return context;
};

export default DraftRepliesContext;
