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
  method: PRMergeRequest["merge_method"];
  setMethod: Dispatch<SetStateAction<PRMergeRequest["merge_method"]>>;
  commitMessage: string;
  setCommitMessage: Dispatch<SetStateAction<string>>;
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
  const [method, setMethod] = useState<PRMergeRequest["merge_method"]>("merge");
  const [commitMessage, setCommitMessage] = useState("");
  const [commitDescription, setCommitDescription] = useState("");

  return (
    <MergeContext
      value={{
        method,
        setMethod,
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
