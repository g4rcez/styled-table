import React, { useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styled from "styled-components";
import { PaginationType, ServerPaginationType } from "./use-pagination";

const Div = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  vertical-align: middle;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const Item = styled.div`
  display: flex;
  flex: auto;
  flex-grow: 0;
`;

const selectClassName =
  "form-select flex border-none cursor-pointer w-auto mr-2 border-b-2";

export const Pagination: React.FC<{
  pagination: PaginationType<any> | ServerPaginationType;
}> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    props.pagination.setPerPage(Number.parseInt(e.target.value));

  const firstDisabled = useMemo(() => props.pagination.currentPage <= 1, [
    props.pagination,
  ]);

  const lastDisabled = useMemo(
    () => props.pagination.maxPage === props.pagination.currentPage,
    [props.pagination]
  );

  const options = useMemo(() => {
    const set = new Set(
      props.pagination.pages.concat(
        props.pagination.itemsPerPage,
        props.pagination.itemsPerPageInitial
      )
    );
    const array = Array.from(set).sort((a, b) => a - b);
    return array.map((x) => (
      <option key={`pagination-item-${x}`} value={x}>
        {x}
      </option>
    ));
  }, [
    props.pagination.pages,
    props.pagination.itemsPerPageInitial,
    props.pagination.itemsPerPage,
  ]);

  return (
    <Div>
      <Item>
        <span className="mr-2">Items per page</span>
        <select
          value={props.pagination.itemsPerPage}
          onChange={onChange}
          className={selectClassName}
        >
          {options}
        </select>
      </Item>
      <Item className="flex flex-auto flex-row flex-grow-0">
        <button disabled={firstDisabled} onClick={props.pagination.goBackward}>
          <FaChevronLeft
            className={`cursor-pointer ${
              firstDisabled ? "text-disabled-light" : "text-dark"
            }`}
          />
        </button>
        <div className="text-disabled ml-2 pl-2 mr-2 pr-2">
          {props.pagination.currentPage} - {props.pagination.maxPage}
        </div>
        <button onClick={props.pagination.goForward} disabled={lastDisabled}>
          <FaChevronRight
            className={`cursor-pointer ${
              lastDisabled ? "text-disabled-light" : "text-dark"
            }`}
          />
        </button>
      </Item>
    </Div>
  );
};
