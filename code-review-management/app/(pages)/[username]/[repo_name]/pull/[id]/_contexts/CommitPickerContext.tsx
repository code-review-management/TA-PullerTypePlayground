import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

const CommitPickerContext = createContext<{
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
  const [selectedSha, setSelectedSha] = useState<string | null>(null);

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
