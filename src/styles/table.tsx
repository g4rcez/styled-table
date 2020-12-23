import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  white-space: nowrap;
  text-align: left;

  & th,
  & td {
    padding: 0.7rem;
  }

  .td-ellipsis {
    max-width: 1px;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    &,
    & thead,
    & tbody,
    & th,
    & td,
    & tr {
      display: block;
    }

    .td-ellipsis {
      max-width: auto;
      overflow: visible;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    & tr {
      border: none;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    & td {
      border: none;
      border-bottom: 1px solid #f2f8f0;
      position: relative;
      padding: 0.8rem 0.45rem;
      align-items: flex-start;
      width: 100%;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }

    & td:last-child,
    & tr:last-child {
      border-bottom: 0 solid transparent;
    }

    & td:before {
      position: absolute;
      top: -0.4rem;
      width: 100%;
      word-break: break-all;
      white-space: pre;
      content: attr(data-title);
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
`;

export const Thead = styled.thead`
  font-size: 1rem;
  font-weight: 100;
  align-items: flex-end;
  border-radius: 0.5rem;
`;
