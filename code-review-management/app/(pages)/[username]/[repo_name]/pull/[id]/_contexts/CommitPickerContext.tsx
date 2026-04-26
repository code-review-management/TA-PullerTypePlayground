import { useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

const CommitPickerContext = createContext<{
  isCommitView: boolean;
  isCumulative: boolean;
  setIsCumulative: Dispatch<SetStateAction<boolean>>;
  selectedSha: string | null;
  setSelectedSha: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export const useCommitPickerContext = () => {
  const context = useContext(CommitPickerContext);
  if (!context) {
    throw new Error(
      "useCommitPickerContext has to be used within <CommitPickerContext>",
    );
  }
  return context;
};

export default function CommitPickerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useSearchParams();
  const sha = params.get("sha");
  const cumulative = params.get("cumulative");

  const [isCumulative, setIsCumulative] = useState(!!cumulative);
  const [selectedSha, setSelectedSha] = useState<string | null>(sha);

  return (
    <CommitPickerContext
      value={{
        isCommitView: sha !== null,
        isCumulative,
        setIsCumulative,
        selectedSha,
        setSelectedSha,
      }}
    >
      {children}
    </CommitPickerContext>
  );
}
