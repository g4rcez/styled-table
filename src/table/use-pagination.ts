import { useEffect, useMemo, useState } from "react";

export type PaginationType<T> = {
  goForward: () => void;
  goBackward: () => void;
  goTo: (page: number) => void;
  list: T[];
  itemsPerPage: number;
  itemsPerPageInitial: number;
  currentPage: number;
  maxPage: number;
  setPerPage: (n: number) => void;
  pages: number[];
  fullLength: number;
};

export const usePagination = <T>(data: T[], itemsPerPage: number = 20, perPages?: number[]): PaginationType<T> => {
  const isEmpty = useMemo(() => data.length === 0, [data.length]);
  const [currentPage, setCurrentPage] = useState(1);

  const fullLength = useMemo(() => data.length, [data.length]);

  const [perPage, setPerPage] = useState(itemsPerPage);

  const maxPage = useMemo(() => (isEmpty ? 1 : Math.ceil(data.length / perPage)), [perPage, data, isEmpty]);

  const pages = useMemo(() => perPages ?? [10, 20, 30], [perPages]);

  const currentData = useMemo((): T[] => {
    const begin = perPage * (currentPage - 1);
    return data.slice(begin, begin + perPage);
  }, [perPage, data, currentPage]);

  useEffect(() => setPerPage(itemsPerPage), [itemsPerPage]);

  const goForward = () => setCurrentPage((c) => Math.min(c + 1, maxPage));

  const goBackward = () => setCurrentPage((c) => Math.max(c - 1, 1));

  const goTo = (page: number) => setCurrentPage(() => Math.min(Math.max(1, page), maxPage));

  const onSetPage = (n: number) => {
    setPerPage(n);
    setCurrentPage(1);
  };

  return {
    goForward,
    fullLength,
    goBackward,
    goTo,
    setPerPage: onSetPage,
    itemsPerPageInitial: itemsPerPage,
    list: currentData,
    itemsPerPage: perPage,
    currentPage,
    maxPage,
    pages
  };
};

export type ServerPaginationType = Omit<PaginationType<any>, "list" | "fullLength">;

export const useServerPagination = (
  totalCount: number = 0,
  itemsPerPage: number = 20,
  perPages?: number[]
): ServerPaginationType => {
  const isEmpty = useMemo(() => totalCount === 0, [totalCount]);
  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(itemsPerPage);

  const maxPage = useMemo(() => (isEmpty ? 1 : Math.ceil(totalCount / perPage)), [perPage, totalCount, isEmpty]);

  const pages = useMemo(() => perPages ?? [10, 20, 30], [perPages]);

  useEffect(() => setPerPage(itemsPerPage), [itemsPerPage]);

  const goForward = () => setCurrentPage((c) => Math.min(c + 1, maxPage));

  const goBackward = () => setCurrentPage((c) => Math.max(c - 1, 1));

  const goTo = (page: number) => setCurrentPage(() => Math.min(Math.max(1, page), maxPage));

  const onSetPage = (n: number) => {
    setPerPage(n);
    setCurrentPage(1);
  };

  return {
    goForward,
    goBackward,
    goTo,
    setPerPage: onSetPage,
    itemsPerPageInitial: itemsPerPage,
    itemsPerPage: perPage,
    currentPage,
    maxPage,
    pages
  };
};
