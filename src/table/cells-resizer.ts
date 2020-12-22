const queryTR = (table: HTMLTableElement): HTMLTableRowElement => table.querySelector("tbody tr") as any;

const queryCells = (table: HTMLTableElement): HTMLTableCellElement[] | undefined => {
  const tr = queryTR(table);
  if (!tr) return;
  return Array.from(tr.getElementsByTagName("td"));
};

const getTableHeaders = (table: HTMLTableElement): HTMLTableHeaderCellElement[] =>
  Array.from(table.querySelectorAll("table > thead > tr > th"));

export const cellsResize = (table: HTMLTableElement) => {
  const tableCells = queryCells(table);
  if (tableCells === undefined) {
    return;
  }

  const totalWidths: { [k: string]: number } = tableCells.reduce((acc, x) => {
    const title: string = x?.dataset?.title!;
    const tdChild: HTMLElement[] = Array.from(x.children as any);
    const sum = tdChild.reduce((s, c) => s + c.getBoundingClientRect().width, 1);
    return { ...acc, [title]: sum };
  }, {});

  const headers = getTableHeaders(table);
  const tableWidth = table.getBoundingClientRect().width;
  const averageWidth = tableWidth / headers.length;
  const tdEllipses: HTMLElement[] = Array.from(table.querySelectorAll(".td-ellipsis"));

  headers.forEach((x, i) => {
    const title = x.dataset.title!;
    const elementWidth = totalWidths[title];
    const td = tdEllipses[i];
    const tdW = td.getBoundingClientRect().width;
    if (elementWidth >= averageWidth) {
      const v = Math.min(tableWidth - elementWidth, averageWidth, tdW + averageWidth) + "px";
      td.style.minWidth = v;
      x.style.width = v;
      return (td.style.width = v);
    }
    const v = Math.min(elementWidth, tdW) + "px";
    td.style.minWidth = v;
    return (td.style.width = v);
  });
};
