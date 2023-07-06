import { ComponentProps, JSX, ParentProps, Show, createContext, useContext } from 'solid-js';

import { forwardNativeElementProps } from '../../Helpers';

import './Table.scss';
import { Dynamic } from 'solid-js/web';
import { Box } from '../../General';
import { mergeClass } from '../../_Shared/Utils';

export interface TableProps extends ParentProps {
  identification: string;

  compact?: boolean;
  boxed?: boolean;
}

const TableContext = createContext<TableProps>();

const Table = forwardNativeElementProps<TableProps, HTMLTableElement>(
  (props, elProps) => {
    const table = <table 
      {...elProps} 
      class={mergeClass('grapes-table', elProps.class)}
      classList={{
        boxed: props.boxed,
        compact: props.compact,
        ...elProps.classList
      }}
    >
      {props.children}
    </table>;
    return <TableContext.Provider value={props}>
      <Show when={props.boxed} fallback={table}>
        <Box class="grapes-table-box">
          {table}
        </Box>
      </Show>
    </TableContext.Provider>;
  },
  ['identification', 'boxed', 'compact', 'children']
) as {
  (props: TableProps & ComponentProps<'table'>): JSX.Element,
  Row(props: TableRowProps & ComponentProps<'tr'>): JSX.Element,
  Column(props: TableColumnProps & ComponentProps<'td'>): JSX.Element
};

export interface TableRowProps extends ParentProps {
  headRow?: boolean;
}

const RowContext = createContext<TableRowProps>();

const Row = forwardNativeElementProps<TableRowProps, HTMLTableRowElement>(
  (props, elProps) => {
    return <RowContext.Provider value={props}>
      <tr {...elProps}>
        {props.children}
      </tr>
    </RowContext.Provider>;
  },
  ['headRow', 'children']
);

export interface TableColumnProps extends ParentProps {
  align?: 'left' | 'right' | 'center';
}

const Column = forwardNativeElementProps<TableColumnProps, HTMLTableCellElement>(
  (props, elProps) => {
    const tableProps = useContext(TableContext);
    const rowProps = useContext(RowContext);

    if (typeof rowProps === 'undefined') {
      if (typeof tableProps !== 'undefined') {
        throw new Error(`Table ${tableProps.identification}: Could not determine what row a certain column inside this table belongs to.`);
      } else {
        throw new Error('A <Table.Column> must be inside a <Table.Row>! Also, could not determine the Table which it belong to either!');
      }
    }

    return <Dynamic 
      component={rowProps.headRow ? 'th' : 'td'}
      {...elProps}
      classList={{
        'align-left': props.align === 'left' || typeof props.align === 'undefined',
        'align-right': props.align === 'right',
        'align-center': props.align === 'center',
      }}
      children={props.children}
    />;
  },
  ['align', 'children']
);

Table.Row = Row;
Table.Column = Column;

export default Table;