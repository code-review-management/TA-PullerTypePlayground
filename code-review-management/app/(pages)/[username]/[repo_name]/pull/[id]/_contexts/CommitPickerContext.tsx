import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const ALL_CHANGES = "all-changes";

const CommitPickerContext = createContext<{
  selectedSha: string;
  setSelectedSha: Dispatch<SetStateAction<string>>;
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
  const [selectedSha, setSelectedSha] = useState(ALL_CHANGES);

  return (
    <CommitPickerContext
      value={{
        selectedSha,
        setSelectedSha,
      }}
    >
      {children}
    </CommitPickerContext>
  );
}
