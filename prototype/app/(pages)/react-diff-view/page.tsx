import ReactDiffView from "@/app/(components)/CodeRendering/ReactDiffView/ReactDiffView";
import { Container, Typography } from "@mui/material";

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
