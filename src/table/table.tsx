import React, {
  Fragment,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Container } from "../styles/grid";
import { StyledTable, Thead } from "../styles/table";
import { BodyCell, HeaderCell, TD } from "./cells";
import { cellsResize } from "./cells-resizer";
import { orderCols } from "./order-cols";
import { orderRows } from "./order-rows";
import { Pagination } from "./pagination";
import { tableColumnsResize } from "./resize-grid";
import { TableSkeletonRow } from "./table-skeleton-row";
import { TableColumns } from "./types";
import { usePagination } from "./use-pagination";

type TR = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

export type TableRowProps<T = never> = Omit<TR, "onClick"> & {
  onClick?(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: T): void;
};

type Table<T = unknown> = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
> & {
  rows: T[];
  tableColumn: TableColumns<T>;
} & Partial<{
    Empty: React.ReactNode;
    onChangeColsPosition: (tableColumn: TableColumns<T>) => void;
    rowProps: (row: T, index: number) => TableRowProps<T>;
    colGroup: string[];
    autoResize: boolean;
    changeCols: boolean;
    resizeCols: boolean;
    changeRows: boolean;
    loading: boolean;
    pages: number[];
    headerClassName: string;
    itemsPerPage: number;
    cellProps: Omit<TD, "children">;
    tableHeaderMenu: React.ReactNode;
  }>;

type TableRow<T> = {
  row: T;
  i: number;
  rowProps?: (
    row: T,
    index: number
  ) => TR & {
    onClick(
      e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      row: any
    ): void;
  };
  cellProps: any;
  autoResize: boolean;
  tableColumn: any;
  loading: boolean;
};

function TableRow<T>(props: TableRow<T>) {
  const rowProps = props.rowProps?.(props.row, props.i);

  return (
    <tr {...rowProps} onClick={(e) => rowProps?.onClick?.(e, props.row)}>
      {props.tableColumn.map(({ dataTitle, ...header }: any) => {
        const children = (props.row as any)[header.cellId];
        const defaultCellRender = (e: string) =>
          e === undefined || e === null ? "-" : `${e}`;
        const cellRender = header.cellRender || defaultCellRender;
        return (
          <BodyCell
            key={`${header.cellId}-value-${props.i}`}
            {...props.cellProps}
            {...header.cellProps}
            autoResize={props.autoResize}
            data-title={header["data-title"]}
            className="fade-in"
          >
            {cellRender(children, {
              row: props.row,
              props: rowProps,
              index: props.i,
            })}
          </BodyCell>
        );
      })}
    </tr>
  );
}

const SkeletonItems = Array.from({ length: 8 }).map(() => ({}));

export const Table: <T>(props: Table<T>) => any = React.forwardRef<
  HTMLTableElement,
  Table<any>
>(
  <T,>(
    {
      onChangeColsPosition,
      resizeCols = true,
      changeCols = true,
      changeRows = false,
      tableColumn,
      cellProps,
      autoResize = true,
      ...props
    }: Table<T>,
    externalRef: any
  ) => {
    const table = useRef<HTMLTableElement>(null);
    useImperativeHandle(externalRef, () => table.current!);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
      if (!isLoading && table?.current) {
        let events: { name: string; el: HTMLElement; event: Function }[] = [];
        if (changeRows) {
          events = orderRows(table.current);
        }
        if (autoResize) cellsResize(table.current);
        return () => {
          events.forEach((x) =>
            x.el.removeEventListener(x.name, x.event as any)
          );
        };
      }
      return undefined;
    }, [isLoading, tableColumn, autoResize, changeRows, resizeCols]);

    useLayoutEffect(() => {
      if (table?.current) {
        if (resizeCols) {
          tableColumnsResize(table.current!);
        }
        if (changeCols) {
          const change = (list: string[]) => {
            if (onChangeColsPosition) {
              const newOrder = list.map((i) =>
                tableColumn.find((x) => (x as any)["data-title"] === i)
              );
              onChangeColsPosition(newOrder as never);
            }
          };
          const removeEvents = orderCols(table.current, change);
          return () => {
            removeEvents.forEach((x) =>
              x.headerCell.removeEventListener("mousedown", x.event)
            );
          };
        }
      }
      return;
    }, [onChangeColsPosition, tableColumn, changeCols, resizeCols]);

    useEffect(() => {
      if (isLoading && props.loading === false) {
        const timeout = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timeout);
      } else {
        return setIsLoading(props.loading || false);
      }
    }, [props.loading, isLoading]);

    const list = useMemo(() => {
      return isLoading ? SkeletonItems : props.rows;
    }, [props.rows, isLoading]);

    const pagination = usePagination(list, props.itemsPerPage, props.pages);

    const paginatedOrFull: T[] = useMemo(
      () =>
        props.itemsPerPage === undefined
          ? ((list as never) as T[])
          : ((pagination.list as never) as T[]),
      [pagination.list, props.itemsPerPage, list]
    );

    const tableColumnsAvailable = useMemo(
      () => tableColumn.filter((x) => x !== false),
      [tableColumn]
    );

    const tableColumns = useMemo(
      () =>
        tableColumnsAvailable.map((item, i) =>
          item === false ? null : (
            <HeaderCell
              {...item}
              autoResize={autoResize}
              key={`${item.cellId}-${i}-header`}
              children={item.headerContent}
            />
          )
        ),
      [tableColumnsAvailable, autoResize]
    );

    return (
      <Fragment>
        {!isLoading && props.itemsPerPage && (
          <Container>
            {props.tableHeaderMenu}
            <Pagination pagination={pagination} />
          </Container>
        )}
        <StyledTable className="table" ref={table}>
          {props.colGroup && (
            <colgroup>
              {props.colGroup.map((width, i) => (
                <col key={`${width}-${i}`} span={1} style={{ width }} />
              ))}
            </colgroup>
          )}
          <Thead>
            <tr>{tableColumns}</tr>
          </Thead>
          <tbody>
            {paginatedOrFull.map((row, i) =>
              isLoading ? (
                <TableSkeletonRow
                  loading={!!isLoading}
                  i={i}
                  autoResize={autoResize}
                  cellProps={cellProps}
                  tableColumn={tableColumnsAvailable}
                  key={`table-row-${i}`}
                />
              ) : (
                <TableRow
                  loading={!!isLoading}
                  i={i}
                  autoResize={autoResize}
                  cellProps={cellProps}
                  tableColumn={tableColumnsAvailable}
                  key={`table-row-${i}`}
                  row={row}
                  rowProps={props.rowProps as any}
                />
              )
            )}
          </tbody>
        </StyledTable>
        {paginatedOrFull.length === 0 && !isLoading && (
          <div>
            {(props.Empty && props.Empty) || (
              <Fragment>
                <div>
                  <p>No records found</p>
                </div>
              </Fragment>
            )}
          </div>
        )}
      </Fragment>
    );
  }
) as any;
