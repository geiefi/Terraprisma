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
          'table w-full border-collapse border-spacing-0 m-0 appearance-none box-border',
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
            'text-[inherit]',
            !tableProps.compact && 'py-1.5 px-3',
            !!tableProps.compact && 'py-2 px-4',
            colType() === 'td' &&
              'text-base border-solid border-0 border-t border-t-[var(--floating-border)] font-semibold',
            colType() === 'th' && ' border-none font-extrabold',

            alignment() === 'left' && 'text-left',
            alignment() === 'right' && 'text-right',
            alignment() === 'center' && 'text-center',

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
            'text-[inherit]',
            !tableProps.compact && 'py-1.5 px-3',
            !!tableProps.compact && 'py-2 px-4',
            colType() === 'td' &&
              'text-base border-solid border-0 border-t border-t-[var(--floating-border)] font-semibold',
            colType() === 'th' && ' border-none font-extrabold',

            alignment() === 'left' && 'text-left',
            alignment() === 'right' && 'text-right',
            alignment() === 'center' && 'text-center',

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
