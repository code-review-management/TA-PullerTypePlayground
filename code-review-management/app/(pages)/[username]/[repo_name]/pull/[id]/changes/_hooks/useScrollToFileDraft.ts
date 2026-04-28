import { useEffect, useState } from "react";

export function useScrollToFileDraft() {
  const [fileDraftFocusPath, setFileDraftFocusPath] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const scrollToFileDraft = () => {
      if (!fileDraftFocusPath) return;
      const draft = document.getElementById(`file-draft-${fileDraftFocusPath}`);
      draft?.scrollIntoView({ block: "start" });
      draft?.querySelector<HTMLElement>(".tiptap")?.focus();
      setFileDraftFocusPath(null);
    };

    scrollToFileDraft();
  }, [fileDraftFocusPath]);

  return { setFileDraftFocusPath };
}
