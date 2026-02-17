"use client";

import { Container, Typography } from "@mui/material";
import ReactDiffView from "@/app/(components)/CodeRendering/ReactDiffView/ReactDiffView";

export default function ReactDiffViewPage() {
  return (
    <Container>
      <Typography component="h1" variant="h4" gutterBottom>
        react-diff-view
      </Typography>
      <ReactDiffView />
    </Container>
  );
}
