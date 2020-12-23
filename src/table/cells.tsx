import styled from "styled-components";
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

const Th = styled.th`
  padding: 0.35rem 0.5rem;
  font-weight: 500;
  border-bottom: 2px solid #f5f5f5;
`;

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
  return (
    <Th {...props}>
      <span className="cursor-default">{children}</span>
    </Th>
  );
};

export const BodyCell: React.FC<
  TD & { autoResize: boolean; "data-title": string }
> = ({ className, autoResize, children, ...props }) => {
  const bodyCellClassName = useClassNames(
    [className],
    { "td-ellipsis": !!autoResize },
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
