"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fafafa",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
          >
            Capstone prototype
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            fontSize="1.125rem"
          >
            Crafted in the rooms adjacent to the pizza place and above the MU
            airport
          </Typography>

          <Button
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
            onClick={() => router.push("/sign-in")}
          >
            Get started
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
