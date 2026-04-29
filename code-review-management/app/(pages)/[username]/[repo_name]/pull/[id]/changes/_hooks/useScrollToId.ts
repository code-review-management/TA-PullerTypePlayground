import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export function useScrollToId(
  activePath: string,
  setIsExpanded: Dispatch<SetStateAction<boolean>>,
  fileDiffRef: RefObject<HTMLDivElement | null>,
) {
  const [scrollId, setScrollId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      const target = document.getElementById(hash);
      if (!target || !fileDiffRef.current?.contains(target)) return;

      setIsExpanded(true);
      setScrollId(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activePath, setIsExpanded, fileDiffRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollId) return;
      const target = document.getElementById(scrollId);

      target?.scrollIntoView({ block: "start" });
      if (scrollId.startsWith("file-draft-")) {
        target?.querySelector<HTMLElement>(".tiptap")?.focus();
      }

      setScrollId(null);
    };
    handleScroll();
  }, [scrollId]);

  return {
    scrollToId: (id: string) => {
      setIsExpanded(true);
      setScrollId(id);
    },
  };
}
