import { PRMergeRequest } from "@/types/request.types";
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

const MergeContext = createContext<{
  mergeMethod: PRMergeRequest["merge_method"];
  setMergeMethod: Dispatch<SetStateAction<PRMergeRequest["merge_method"]>>;
  commitMessage: string | null;
  setCommitMessage: Dispatch<SetStateAction<string | null>>;
  commitDescription: string;
  setCommitDescription: Dispatch<SetStateAction<string>>;
} | null>(null);

export const useMergeContext = () => {
  const context = useContext(MergeContext);
  if (!context) {
    throw new Error("useMergeContext has to be used within <MergeContext>");
  }
  return context;
};

export default function MergeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mergeMethod, setMergeMethod] = useState<PRMergeRequest["merge_method"]>("merge");
  // Initialize `commitMessage` with null so the useEffect in `MergePopover`
  // knows it hasn't been set yet and should initialize it with the PR title.
  const [commitMessage, setCommitMessage] = useState<string | null>(null);
  const [commitDescription, setCommitDescription] = useState("");

  return (
    <MergeContext
      value={{
        mergeMethod,
        setMergeMethod,
        commitMessage,
        setCommitMessage,
        commitDescription,
        setCommitDescription,
      }}
    >
      {children}
    </MergeContext>
  );
}
