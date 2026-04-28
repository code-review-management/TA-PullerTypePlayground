import { useEffect, useState } from "react";

export function useScrollToId() {
  const [scrollId, setScrollId] = useState<string | null>(null);

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
