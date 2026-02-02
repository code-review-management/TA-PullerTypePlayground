"use client";

import CustomReactDiffView from "@/app/(components)/CodeRendering/ReactDiffView/CustomReactDiffView";
import { Container, Typography } from "@mui/material";

export default function ReactDiffViewPage() {
  return (
    <Container>
      <Typography component="h1" variant="h4" gutterBottom>
        react-diff-view (with custom modifications)
      </Typography>
      <CustomReactDiffView />
    </Container>
  );
}
