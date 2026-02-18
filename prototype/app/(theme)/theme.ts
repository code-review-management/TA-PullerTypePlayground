"use client";

import { createTheme } from "@mui/material/styles";

/**
 * Documentation:
 * 1. https://mui.com/material-ui/customization/css-theme-variables/usage/
 * 2. https://mui.com/material-ui/integrations/nextjs/
 */

export const theme = createTheme({
  cssVariables: true,
  diff: {
    code: {
      deleteBg: "#ffebe9",
      deleteEditBg: "#ffcecb",
      emptyBg: "#f6f8fa",
      highlightBg: "#fffbdd",
      insertBg: "#dafbe1",
      insertEditBg: "#aceebb",
    },
    gutter: {
      deleteBg: "#ffcecb",
      highlightBg: "#fff5b1",
      insertBg: "#aceebb",
      omitBg: "#f6f8fa",
    },
    decorationBg: "#dbf2ff",
  },
});

interface DiffStyle {
  code: {
    deleteBg: string;
    deleteEditBg: string;
    emptyBg: string;
    highlightBg: string;
    insertBg: string;
    insertEditBg: string;
  };
  gutter: {
    deleteBg: string;
    highlightBg: string;
    insertBg: string;
    omitBg: string;
  };
  decorationBg: string;
}

declare module "@mui/material/styles" {
  interface Theme {
    diff: DiffStyle;
  }

  interface ThemeOptions {
    diff: DiffStyle;
  }
}
