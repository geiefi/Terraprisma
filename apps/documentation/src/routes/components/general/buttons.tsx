import { Table } from '@terraprisma/data-display';
import { Button } from '@terraprisma/general';
import { A } from 'solid-start';
import { CodeExample } from '~/components/CodeExample';

export default function Buttons() {
  return (
    <article>
      <h1>Buttons</h1>

      <p>
        Terraprisma has a few buttons, a few variants separated into differente
        components. A list of these components is:
      </p>

      <ul>
        <li>
          <A href="#default">Button</A>
        </li>
        <li>IconButton - circular button made for icons</li>
        <li>
          OutlinedButton - a button with an outline that when hovering becomes
          the default
        </li>
        <li>
          TextButton - a button that looks like text normally and when hovered
          becomes a opaque version of its color
        </li>
      </ul>

      <h2 id="default">Button</h2>

      <CodeExample
        source={`<Button>Click me</Button>`}
        preview={<Button>Click me</Button>}
      />

      <Table identification="button api reference table">
        <Table.Row headRow>
        </Table.Row>
      </Table>
    </article>
  );
}
