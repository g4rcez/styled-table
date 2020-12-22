import { StyledComponent } from "styled-components";

export type HtmlTableProps = StyledComponent<"table", any, {}, never>;

export type TableProps<T = any> = HtmlTableProps & {
  rowProps?: (
    row: T,
    index: number
  ) => Omit<StyledComponent<"tr", any, {}, never>, "onClick"> & {
    onClick?(
      e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      row: T
    ): void;
  };
  rows: T[];
  loading?: boolean;
  tableColumn: TableColumns<T>[];
  cellProps?: Omit<StyledComponent<"td", any, {}, never>, "children">;
};

export type TableRow<T> = {
  row: T;
  i: number;
  rowProps?: (
    row: T,
    index: number
  ) => StyledComponent<"tr", any, {}, never> & {
    onClick(
      e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      row: any
    ): void;
  };
  cellProps: any;
  tableColumn: any;
  loading: boolean;
};

export type TableColumns<T = never> = (
  | (StyledComponent<"th", any, {}, never> & {
      "data-title": string;
      cellId: keyof T | string;
      headerContent: React.ReactNode;
      cellProps?: StyledComponent<"td", any, {}, never>;
      cellRender?: (
        data: T[keyof T],
        props: {
          row: T;
          props?: StyledComponent<"tr", any, {}, never>;
          hover: boolean;
          index: number;
        }
      ) => React.ReactNode;
    })
  | false
)[];
