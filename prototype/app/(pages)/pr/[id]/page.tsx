'use client';

import { Container, Typography } from "@mui/material";
import { useParams } from 'next/navigation'
import DiffView from "@/app/(components)/CodeRendering/DiffView/DiffView";

const sampleCodeString = `export default function Page() {
    return (
        <div>
          <h1>Hello world</h1>
        </div>
    );
}

// supersupersupersupersupersupersupersupersuper longggggg line! oh no how will we fit this line? it's long uh oh oh no :(`;

const diffSample1 = `export default function Page() {
    return (
        <div>
          <h1>Hello world</h1>
        </div>
    );
}`;

const diffSample2 = `export default function Page() {
  const message = "Hello world";

    return (
        <div>
          <h1>{message}</h1>
        </div>
    );
}`;

const parsed = sampleCodeString.split('\n');
const parsed1 = diffSample1.split('\n');
const parsed2 = diffSample2.split('\n');

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
      <Typography variant="h3" gutterBottom>
        Diff View
      </Typography>
      <DiffView message1={diffSample1} message2={diffSample2}/>
    </Container>
  );
}
