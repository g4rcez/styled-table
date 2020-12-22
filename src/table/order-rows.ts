export const orderRows = (table: HTMLTableElement) => {
  let draggingEle: HTMLElement;
  let draggingRowIndex: number;
  let placeholder: any;
  let list: HTMLDivElement;
  let isDraggingStarted = false;

  // The current position of mouse relative to the dragging element
  let x = 0;
  let y = 0;

  // Swap two nodes
  const swap = (nodeA: HTMLElement, nodeB: HTMLElement) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode!.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA!.insertBefore(nodeB, siblingA);
  };

  // Check if `nodeA` is above `nodeB`
  const isAbove = (nodeA: HTMLElement, nodeB: HTMLElement) => {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  const cloneTable = function () {
    const rect = table.getBoundingClientRect();
    const width = parseInt(window.getComputedStyle(table).width);

    list = document.createElement("div");
    list.classList.add("o-clone-list");
    list.style.position = "absolute";
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;
    table.parentNode!.insertBefore(list, table);

    table.style.visibility = "hidden";

    table.querySelectorAll("tr").forEach((row) => {
      const item = document.createElement("div");

      item.classList.add("o-draggable");

      const newTable = document.createElement("table");
      newTable.setAttribute("class", "o-clone-table");
      newTable.style.width = `${width}px`;

      const newRow = document.createElement("tr");
      [...((row.children as any) as HTMLTableRowElement[])].forEach((cell) => {
        const newCell = cell.cloneNode(true) as HTMLTableRowElement;
        newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
        newRow.appendChild(newCell);
      });

      newTable.appendChild(newRow);
      item.appendChild(newTable);
      list.appendChild(item);
    });
  };

  const mouseDownHandler = (e: any) => {
    let originalRow: HTMLElement = e.target.parentNode;
    if (originalRow.tagName === "TD") {
      originalRow = originalRow.parentNode as never;
    }
    draggingRowIndex = [...(table.querySelectorAll("tr") as any)].indexOf(originalRow);

    x = e.clientX;
    y = e.clientY;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e: any) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;

      cloneTable();

      draggingEle = [...(list.children as never)][draggingRowIndex];
      draggingEle.classList.add("o-dragging");

      // Let the placeholder take the height of dragging element
      // So the next element won't move up
      placeholder = document.createElement("div");
      placeholder.classList.add("o-placeholder");
      draggingEle.parentNode!.insertBefore(placeholder, draggingEle.nextSibling);
      placeholder.style.height = `${draggingEle.offsetHeight}px`;
    }

    draggingEle.style.position = "absolute";
    draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
    draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

    x = e.clientX;
    y = e.clientY;

    const prevEle: HTMLElement = draggingEle.previousElementSibling as never;
    const nextEle = placeholder.nextElementSibling;

    if (prevEle && prevEle.previousElementSibling && isAbove(draggingEle, prevEle)) {
      swap(placeholder, draggingEle);
      swap(placeholder, prevEle);
      return;
    }

    if (nextEle && isAbove(nextEle, draggingEle)) {
      swap(nextEle, placeholder);
      swap(nextEle, draggingEle);
    }
  };

  const mouseUpHandler = () => {
    placeholder && placeholder.parentNode.removeChild(placeholder);

    draggingEle.classList.remove("o-dragging");
    draggingEle.style.removeProperty("top");
    draggingEle.style.removeProperty("left");
    draggingEle.style.removeProperty("position");

    const endRowIndex = [...(list.children as any)].indexOf(draggingEle);

    isDraggingStarted = false;

    list.parentNode?.removeChild(list);

    let rows = [...(table.querySelectorAll("tr") as any)];
    draggingRowIndex > endRowIndex
      ? (rows[endRowIndex] as any)?.parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex] as any)
      : (rows[endRowIndex] as any)?.parentNode.insertBefore(
          rows[draggingRowIndex],
          (rows[endRowIndex] as any).nextSibling
        );

    table.style.removeProperty("visibility");
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };
  const events: { name: string; el: HTMLElement; event: Function }[] = [];
  table.querySelectorAll("tr").forEach((row, index) => {
    if (index === 0) {
      return;
    }
    const firstCell = row.firstElementChild!;
    firstCell.classList.add("o-draggable");
    firstCell.addEventListener("mousedown", mouseDownHandler);
    events.push({ name: "mousedown", event: mouseDownHandler, el: firstCell as any });
  });
  return events;
};
