"use client";

import BareReactDiffView from "@/app/(components)/CodeRendering/ReactDiffView/BareReactDiffView";
import { Container, Typography } from "@mui/material";

export default function ReactDiffViewPage() {
  return (
    <Container>
      <Typography component="h1" variant="h4" gutterBottom>
        react-diff-view (out-of-box bare component with no modifications)
      </Typography>
      <BareReactDiffView />
    </Container>
  );
}
