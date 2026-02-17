import { Box, Typography } from "@mui/material";

export default function FileHeader({ newPath }: { newPath: string }) {
  return (
    <Box
      sx={{
        padding: "8px 6px",
        backgroundColor: "rgb(246, 248, 250)",
        borderBottom: "0.5px solid rgb(209, 217, 224)",
      }}
    >
      <Typography variant="body2">{newPath}</Typography>
    </Box>
  );
}
