import { useLayoutEffect, useState } from "react";

export const useIsOverflow = (abbr_sha: string) => {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const current = document.getElementById(`commit-${abbr_sha}-message`);
    if (!current) {
        return undefined;
    }

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [abbr_sha]);

  return isOverflow;
};