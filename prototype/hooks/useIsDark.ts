import { useEffect, useState } from "react";

/**
 * Hook to get state of system setting for light/dark theme.
 */
export default function useIsDark() {
    const [isDark, setIsDark] = useState(false);

    function refreshIsDark(event: MediaQueryListEvent) {
        console.log(event);
        if (event.matches) {
            setIsDark(true);
            console.log("set to dark");
        } else {
            setIsDark(false);
            console.log("set to light");
        }
    }

    useEffect(() => {
        // TODO: Deal with this
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                refreshIsDark(e);
                console.log("change");
            });

        return () => {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", refreshIsDark);
        };
    }, []);

    return { isDark };
}
