import React from "react";
import { useClassNames } from "../hooks/use-classnames";
export type TH = React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>;
export type TD = React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
>;

export const HeaderCell: React.FC<TH & any & { autoResize: boolean }> = ({
  className,
  cellRender,
  headerContent,
  cellProps,
  autoResize,
  cellId,
  children,
  ...props
}) => {
  const headerClassName = useClassNames(
    [className],
    "px-2 py-3 bg-base text-default",
    className
  );
  return (
    <th {...props} className={headerClassName}>
      <span className="cursor-default">{children}</span>
    </th>
  );
};

export const BodyCell: React.FC<
  TD & { autoResize: boolean; "data-title": string }
> = ({ className, autoResize, children, ...props }) => {
  const bodyCellClassName = useClassNames(
    [className],
    { "td-ellipsis": !!autoResize },
    "p-2 text-default",
    className
  );
  return (
    <td
      {...props}
      data-title={props["data-title"]}
      className={bodyCellClassName}
    >
      <span className="w-fit">{children}</span>
    </td>
  );
};
