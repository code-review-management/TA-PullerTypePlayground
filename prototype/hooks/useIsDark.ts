import { useEffect, useState } from "react";

/**
 * Hook to get state of system setting for light/dark theme.
 */
export default function useIsDark() {
    const [isDark, setIsDark] = useState(false);

    function refreshIsDark(event: MediaQueryListEvent) {
        if (event.matches) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
    }

    useEffect(() => {
        // TODO: Deal with this
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", refreshIsDark);

        return () => {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", refreshIsDark);
        };
    }, []);

    return { isDark };
}
