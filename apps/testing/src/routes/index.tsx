import { Title } from "solid-start";

import { AccountCircle } from "@terraprisma/icons";
import { Box, Button } from "@terraprisma/core";
import { Container } from "@terraprisma/layout";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <Container horizontalAlign="center">
        <Box style={{ width: "fit-content" }}>
          <Button color="accent" size="small">
            <AccountCircle/> Create account
          </Button>
        </Box>
      </Container>
    </main>
  );
}
