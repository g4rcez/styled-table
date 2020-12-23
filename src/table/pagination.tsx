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

  & > select {
    cursor: pointer;
    border: 1px solid transparent;
  }

  & > button {
    cursor: pointer;
    background-color: transparent;
    border: 1px solid transparent;
  }
`;

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
        <select value={props.pagination.itemsPerPage} onChange={onChange}>
          {options}
        </select>
      </Item>
      <Item>
        <button disabled={firstDisabled} onClick={props.pagination.goBackward}>
          <FaChevronLeft />
        </button>
        <div>
          {props.pagination.currentPage} - {props.pagination.maxPage}
        </div>
        <button onClick={props.pagination.goForward} disabled={lastDisabled}>
          <FaChevronRight />
        </button>
      </Item>
    </Div>
  );
};
