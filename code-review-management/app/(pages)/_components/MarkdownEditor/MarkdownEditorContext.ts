import { createContext, Dispatch, SetStateAction, useContext } from "react";

const MarkdownEditorContext = createContext<{
  getMarkdown: () => string;
  setEditable: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const useMarkdownEditorContext = () => {
  const context = useContext(MarkdownEditorContext);
  if (!context) {
    throw new Error(
      "useMarkdownEditorContext has to be used within <MarkdownEditorContext>",
    );
  }
  return context;
};

export default MarkdownEditorContext;
