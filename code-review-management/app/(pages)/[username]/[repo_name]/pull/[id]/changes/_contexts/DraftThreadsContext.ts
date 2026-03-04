import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { DraftThreads } from "../_hooks/useDraftThreads";

/**
 * Docs:
 * 1. https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#without-default-context-value
 */
const DraftThreadsContext = createContext<{
  draftThreads: DraftThreads;
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>;
} | null>(null);

export const useDraftThreadsContext = () => {
  const context = useContext(DraftThreadsContext);
  if (!context) {
    throw new Error(
      "useDraftThreadsContext has to be used within <DraftThreadsContext>",
    );
  }
  return context;
};

export default DraftThreadsContext;
