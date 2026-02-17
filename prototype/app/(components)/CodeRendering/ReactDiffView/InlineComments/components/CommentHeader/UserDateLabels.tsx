import { Stack, Typography } from "@mui/material";

/**
 * TODO: consider other labels like "pending", "last edited at", etc.
 * TODO: remove hard-coded styling.
 */

export default function UserDateLabels({
  username,
  date,
}: {
  username: string;
  date?: string;
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Typography
        sx={{
          fontSize: "12px",
          pl: 1,
          fontWeight: 600,
          color: "rgb(50, 50, 50)",
          lineHeight: 1,
        }}
      >
        {username}
      </Typography>
      {date && (
        <Typography
          sx={{
            fontSize: "11px",
            color: "text.secondary",
            lineHeight: 1,
          }}
        >
          {date}
        </Typography>
      )}
    </Stack>
  );
}
