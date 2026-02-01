import { Box } from "@mui/material";

export default function FileHeader({ newPath }: { newPath: string }) {
  return (
    <Box sx={{ padding: "8px 16px" }}>
      {newPath}
    </Box>
  );
}
