export const orderCols = (
  table: HTMLTableElement,
  onChangeOrder: (list: string[]) => void
): Array<{ headerCell: HTMLTableHeaderCellElement; event: any }> => {
  let draggingEle: HTMLElement;
  let draggingColumnIndex: number;
  let placeholder: any;
  let list: HTMLDivElement;
  let isDraggingStarted = false;

  let x = 0;
  let y = 0;

  const swap = (
    nodeA: NonNullable<HTMLElement>,
    nodeB: NonNullable<HTMLElement>
  ) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode!.insertBefore(nodeA, nodeB);
    parentA!.insertBefore(nodeB, siblingA);
  };

  const isOnLeft = function (
    nodeA: NonNullable<HTMLElement>,
    nodeB: NonNullable<HTMLElement>
  ) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
  };

  const cloneTable = function () {
    const rect = table.getBoundingClientRect();
    list = document.createElement("div");
    list.classList?.add("clone-list");
    list.style.position = "absolute";
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;
    table.parentNode!.insertBefore(list, table);
    table.style.visibility = "hidden";
    const originalCells = [].slice.call(table.querySelectorAll("tbody td"));
    const originalHeaderCells: HTMLElement[] = [].slice.call(
      table.querySelectorAll("th")
    );
    const numColumns = originalHeaderCells.length;
    originalHeaderCells.forEach((headerCell, headerIndex) => {
      const width = parseInt(window.getComputedStyle(headerCell).width);
      const item = document.createElement("div");
      item.classList?.add("draggable");

      const newTable = document.createElement("table");
      newTable.setAttribute("class", "clone-table");
      newTable.style.width = `${width}px`;

      const th = (headerCell as any).cloneNode(true);
      let newRow = document.createElement("tr");
      newRow.appendChild(th);
      newTable.appendChild(newRow);

      const cells: HTMLElement[] = originalCells.filter(
        (_, idx) => (idx - headerIndex) % numColumns === 0
      );
      cells.forEach((cell) => {
        const newCell: HTMLElement = cell.cloneNode(true) as never;
        newCell.style.width = `${width}px`;
        newRow = document.createElement("tr");
        newRow.appendChild(newCell);
        newTable.appendChild(newRow);
      });

      item.appendChild(newTable);
      list.appendChild(item);
    });
  };

  const mouseDownHandler = (e: any) => {
    e.stopPropagation();
    const th: HTMLElement = e.target;
    const thList: HTMLTableColElement[] = Array.from(
      table.querySelectorAll("th")
    ) as any;
    draggingColumnIndex = thList.indexOf(th as never);
    if (draggingColumnIndex === -1) {
      const dataTitle = th.dataset.title;
      if (!dataTitle) {
        return;
      }
      const elementParent: HTMLTableColElement = table.querySelector(
        `[data-title="${dataTitle}"]`
      ) as never;
      draggingColumnIndex = thList.indexOf(elementParent);
    }
    x = e.clientX - e.target.offsetLeft;
    y = e.clientY - e.target.offsetTop;
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e: any) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;
      cloneTable();
      draggingEle = list.children[draggingColumnIndex] as HTMLDivElement;
      draggingEle.classList?.add?.("dragging");
      placeholder = document.createElement("div");
      placeholder.classList?.add("placeholder");
      draggingEle.parentNode!.insertBefore(
        placeholder,
        draggingEle.nextSibling
      );
      placeholder.style.width = `${draggingEle.offsetWidth}px`;
    }

    draggingEle.style.position = "absolute";
    draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
    draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

    x = e.clientX;
    y = e.clientY;

    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;

    if (prevEle && isOnLeft(draggingEle, prevEle as HTMLElement)) {
      swap(placeholder, draggingEle);
      swap(placeholder, prevEle as HTMLElement);
      return;
    }

    if (nextEle && isOnLeft(nextEle, draggingEle)) {
      swap(nextEle, placeholder);
      swap(nextEle, draggingEle);
    }
  };

  const mouseUpHandler = function () {
    placeholder && placeholder.parentNode.removeChild(placeholder);
    if (draggingEle === undefined) return;
    draggingEle?.classList?.remove("dragging");
    draggingEle?.style.removeProperty("top");
    draggingEle?.style.removeProperty("left");
    draggingEle?.style.removeProperty("position");

    const endColumnIndex = Array.from(list.children).indexOf(draggingEle);

    isDraggingStarted = false;

    list.parentNode?.removeChild(list);

    table.querySelectorAll("tr").forEach((row) => {
      const cells = Array.from(row.querySelectorAll("th, td")) as any;
      draggingColumnIndex > endColumnIndex
        ? cells[endColumnIndex].parentNode.insertBefore(
            cells[draggingColumnIndex],
            cells[endColumnIndex]
          )
        : cells[endColumnIndex].parentNode.insertBefore(
            cells[draggingColumnIndex],
            cells[endColumnIndex].nextSibling
          );
    });

    table.style.removeProperty("visibility");

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    const newOrder = table.querySelectorAll("thead > tr > th");
    const newStringItems: string[] = [];
    newOrder.forEach((x) => {
      const th: HTMLElement = x as never;
      newStringItems.push(th.dataset.title as string);
    });
    onChangeOrder(newStringItems);
  };

  const events: Array<{
    headerCell: HTMLTableHeaderCellElement;
    event: any;
  }> = [];

  table.querySelectorAll("th").forEach((headerCell) => {
    if (!headerCell) return;
    headerCell.classList.add("draggable");
    headerCell.addEventListener("mousedown", mouseDownHandler);
    events.push({ headerCell, event: mouseDownHandler });
  });
  return events;
};
