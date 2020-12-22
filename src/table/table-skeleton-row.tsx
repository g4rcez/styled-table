import React from "react";
import { Skeleton } from "../skeleton";
import { BodyCell } from "./cells";
type TableRow = {
  i: number;
  cellProps: any;
  tableColumn: any;
  loading: boolean;
  autoResize: boolean;
};
export const TableSkeletonRow = (props: TableRow) => {
  return (
    <tr>
      {props.tableColumn.map((header: any, index: number) => {
        return (
          <BodyCell
            {...props.cellProps}
            data-title={header["data-title"]}
            key={`${header.cellId}-${header.headerContent}-${props.i}`}
          >
            <Skeleton
              width={index % 2 === 0 ? "80%" : "60%"}
              speed={1.5}
              height={22}
              radius={20}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              className="pt-1"
            >
              <rect x="0" y="0" rx="3" ry="3" width="100%" height="15" />
            </Skeleton>
          </BodyCell>
        );
      })}
    </tr>
  );
};
