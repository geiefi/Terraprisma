import {
  ComponentProps,
  JSX,
  ParentProps,
  createContext,
  createMemo,
  useContext
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { extendPropsFrom, makeComponent, mergeClass } from '@terraprisma/utils';

export interface TableProps extends ParentProps {
  identification: string;

  compact?: boolean;
}

const TableContext = createContext<TableProps>();

const Table = makeComponent(
  [
    extendPropsFrom<TableProps, 'table'>([
      'identification',
      'compact',
      'children'
    ])
  ],
  (props, elProps) => {
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
  }
) as {
  (props: TableProps & ComponentProps<'table'>): JSX.Element;
  Row(props: TableRowProps & ComponentProps<'tr'>): JSX.Element;
  Column(props: TableColumnProps & ComponentProps<'td'>): JSX.Element;
};

export interface TableRowProps extends ParentProps {
  headRow?: boolean;
}

const RowContext = createContext<TableRowProps>();

const Row = makeComponent(
  [extendPropsFrom<TableRowProps, 'tr'>(['headRow', 'children'])],
  (props, elProps) => {
    return (
      <RowContext.Provider value={props}>
        <tr {...elProps}>{props.children}</tr>
      </RowContext.Provider>
    );
  }
);

export interface TableColumnProps extends ParentProps {
  align?: 'left' | 'right' | 'center';
}

const Column = makeComponent(
  [extendPropsFrom<TableColumnProps, 'th'>(['align', 'children'])],
  (props, elProps) => {
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
      <Dynamic
        component={colType()}
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
        children={props.children}
      />
    );
  }
);

Table.Row = Row;
Table.Column = Column;

export default Table;
