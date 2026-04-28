import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useScrollToId(
  activePath: string,
  setIsExpanded: Dispatch<SetStateAction<boolean>>,
) {
  const [scrollId, setScrollId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      const target = document.getElementById(hash);
      const fileDiff = document.getElementById(`file-${activePath}`); // TODO: Consider ref.
      if (!target || !fileDiff?.contains(target)) return; // TODO: Consider file diff anchors.

      setIsExpanded(true);
      setScrollId(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activePath, setIsExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollId) return;
      const target = document.getElementById(scrollId);
      target?.scrollIntoView({ block: "start" });
      target?.querySelector<HTMLElement>(".tiptap")?.focus();
      setScrollId(null);
    };

    handleScroll();
  }, [scrollId]);

  return { setScrollId };
}
