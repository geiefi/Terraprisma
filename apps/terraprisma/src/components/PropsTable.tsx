import { For, JSX } from 'solid-js';
import { useLocation } from '@solidjs/router';

import { Table } from 'terraprisma';

export function PropsTable(props: {
  schemaPerProperty: Record<
    string,
    { default?: JSX.Element; type: JSX.Element; description?: JSX.Element }
  >;
}) {
  const location = useLocation();

  return (
    <Table identification={`API Reference table at ${location.pathname}`}>
      <Table.Row headRow>
        <Table.Column>Property</Table.Column>
        <Table.Column>Description</Table.Column>
        <Table.Column>Type</Table.Column>
        <Table.Column>Default</Table.Column>
      </Table.Row>
      <For each={Object.entries(props.schemaPerProperty)}>
        {([property, schema]) => (
          <Table.Row>
            <Table.Column>{property}</Table.Column>
            <Table.Column>{schema.description ?? '-'}</Table.Column>
            <Table.Column>{schema.type}</Table.Column>
            <Table.Column>{schema.default ?? '-'}</Table.Column>
          </Table.Row>
        )}
      </For>
    </Table>
  );
}
