import {
  ComponentProps,
  Match,
  Switch,
  createContext,
  createMemo,
  splitProps,
  useContext
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { mergeClass } from '../../utils';
import { LeftIntersection } from '../../types/LeftIntersection';

export type TableProps = LeftIntersection<
  {
    identification: string;

    compact?: boolean;
  },
  ComponentProps<'table'>
>;

const TableContext = createContext<TableProps>();

const Table = (allProps: TableProps) => {
  const [props, elProps] = splitProps(allProps, [
    'identification',
    'compact',
    'children'
  ]);
  return (
    <TableContext.Provider value={props}>
      <table
        {...elProps}
        class={mergeClass(
          'tp-table tp-w-full tp-border-collapse tp-border-spacing-0 tp-m-0 tp-appearance-none tp-box-border',
          elProps.class
        )}
      >
        {props.children}
      </table>
    </TableContext.Provider>
  );
};

export type TableRowProps = LeftIntersection<
  {
    headRow?: boolean;
  },
  ComponentProps<'tr'>
>;

const RowContext = createContext<TableRowProps>();

const Row = (allProps: TableRowProps) => {
  const [_, elProps] = splitProps(allProps, ['headRow']);
  return (
    <RowContext.Provider value={allProps}>
      <tr {...elProps}>{elProps.children}</tr>
    </RowContext.Provider>
  );
};

export type TableColumnProps = LeftIntersection<
  {
    align?: 'left' | 'right' | 'center';
  },
  ComponentProps<'th'>
>;

const Column = (allProps: TableColumnProps) => {
  const [props, elProps] = splitProps(allProps, ['align', 'children']);
  const tableProps = useContext(TableContext);
  const rowProps = useContext(RowContext);

  if (typeof tableProps === 'undefined') {
    throw new Error('A <Table.Column> must be inside a <Table>!');
  }

  if (typeof rowProps === 'undefined') {
    throw new Error(
      `Table ${tableProps.identification}: Could not determine what row a certain column inside this table belongs to.`
    );
  }

  const colType = createMemo(() => (rowProps.headRow ? 'th' : 'td'));
  const alignment = createMemo(() => props.align ?? 'left');

  return (
    <Switch>
      <Match when={colType() === 'th'}>
        <th
          {...elProps}
          class={mergeClass(
            'tp-text-[inherit]',
            !tableProps.compact && 'tp-py-1.5 tp-px-3',
            !!tableProps.compact && 'tp-py-2 tp-px-4',
            colType() === 'td' &&
              'tp-text-base tp-border-solid tp-border-0 tp-border-t tp-border-t-[var(--floating-border)] tp-font-semibold',
            colType() === 'th' && ' tp-border-none tp-font-extrabold',

            alignment() === 'left' && 'tp-text-left',
            alignment() === 'right' && 'tp-text-right',
            alignment() === 'center' && 'tp-text-center',

            elProps.class
          )}
        >
          {props.children}
        </th>
      </Match>
      <Match when={colType() === 'td'}>
        <td
          {...elProps}
          class={mergeClass(
            'tp-text-[inherit]',
            !tableProps.compact && 'tp-py-1.5 tp-px-3',
            !!tableProps.compact && 'tp-py-2 tp-px-4',
            colType() === 'td' &&
              'tp-text-base tp-border-solid tp-border-0 tp-border-t tp-border-t-[var(--floating-border)] tp-font-semibold',
            colType() === 'th' && ' tp-border-none tp-font-extrabold',

            alignment() === 'left' && 'tp-text-left',
            alignment() === 'right' && 'tp-text-right',
            alignment() === 'center' && 'tp-text-center',

            elProps.class
          )}
        >
          {props.children}
        </td>
      </Match>
    </Switch>
  );
};

Table.Row = Row;
Table.Column = Column;

export default Table;
