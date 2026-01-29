'use client';

import { Container, Typography } from "@mui/material";
import { useParams } from 'next/navigation'
import DiffView from "@/app/(components)/DiffView/DiffView";

export default function PRPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        PR {id}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Author: John Doe
      </Typography>
      <DiffView />
    </Container>
  );
}
