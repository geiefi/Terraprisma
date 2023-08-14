import { Component } from 'solid-js';

import { Container } from 'grapos/Layout';
import { Box } from 'grapos/General';
import { Paragraph, Title, Typography } from 'grapos/Typography';
import { Code, Marked, Decorated } from 'grapos/Typography/Highlighters';

const TypographyTest: Component = () => {
  return (
    <Container
      maxWidth="md"
      style={{ 'min-height': '100vh' }}
      horizontalAlign="center"
      verticalAlign="center"
    >
      <Box
        depth={3}
        style={{
          width: '100%',
          'max-width': '768px',
          'min-height': '568px',
          'height': 'fit-content',
          'display': 'flex',
          'flex-direction': 'column',
        }}
      >
        <Typography>
          <Title>Introduction</Title>
          <Paragraph>
            In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the efficiency of <Decorated decoration='overlined'>development</Decorated>.
          </Paragraph>

          <Paragraph>
            After <Marked>massive project practice and summaries</Marked>, Ant Design, a design language for background applications, is refined by Ant UED Team, which aims to uniform the user interface specs for internal background projects, lower the unnecessary cost of design differences and implementation and liberate the resources of design and front-end development.
          </Paragraph>

          <Title>Guidelines and Resources</Title>

          <Paragraph>
            We supply a series of design principles, practical patterns and high quality design resources 
            (<Code>Sketch</Code> and <Code>Axure</Code>), to help people create their product prototypes beautifully and efficiently.
          </Paragraph>

          <ul>
            <li><a href="#">Principles</a></li>
            <li><a href="#">Patterns</a></li>
            <li><a href="#">Resource Download</a></li>
          </ul>
        </Typography>
      </Box>
    </Container >
  );
};

export default TypographyTest