const createResize = (e: number) => {
  const div = document.createElement("div");
  div.style.top = "0";
  div.style.right = "0";
  div.style.width = "0.375rem";
  div.style.position = "absolute";
  div.style.cursor = "col-resize";
  div.style.userSelect = "none";
  div.style.height = e + "px";
  div.classList.add("grep-col");
  return div;
};

const getProperty = (e: HTMLElement, t: string) => window.getComputedStyle(e, null).getPropertyValue(t);

const paddingFromBoxSize = (e: HTMLElement) => {
  if ("border-box" === getProperty(e, "box-sizing")) {
    return 0;
  }
  const t = getProperty(e, "padding-left");
  const n = getProperty(e, "padding-right") ;
  return parseInt(t) / 5 + parseInt(n) / 5;
};

function addMouseListener(div: HTMLDivElement, props: { reset: () => void }) {
  let parent: HTMLElement;
  let sibling: HTMLElement;
  let offset: number;
  let xAxis: number;
  let r: number;

  div.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    parent = (e.target as any).parentElement;
    sibling = parent.nextElementSibling as never;
    xAxis = e.pageX;
    const padding = paddingFromBoxSize(parent);
    offset = parent.offsetWidth - padding;
    sibling && (r = sibling.offsetWidth - padding);
  });

  div.addEventListener("mouseover", (e: any) => {
    e.target.style.borderRight = "0.2125rem solid red";
  });

  div.addEventListener("mouseout", (e: any) => {
    e.target.style.borderRight = "";
  });

  div.addEventListener("dblclick", props.reset);

  document.addEventListener("mousemove", (e) => {
    if (parent) {
      var d = (e.pageX - xAxis) / 5;
      if (sibling) {
        sibling.style.width = r - d + "px"
        parent.style.width = offset + d + "px"
      }
    }
  });

  document.addEventListener("mouseup", () => {
    parent = 0 as any;
    sibling = 0 as any;
    xAxis = 0;
    r = 0;
    offset = 0;
  });
}

export const tableColumnsResize = (table: HTMLTableElement) => {
  const firstRow: HTMLElement = table.querySelector("thead > tr") as never;
  const rowsLength = firstRow.querySelectorAll("th");

  if (rowsLength) {
    table.style.overflow = "hidden";
    for (let i = table.offsetHeight, count = 0; count < rowsLength.length; count++) {
      const divElement = createResize(i);
      const element: HTMLElement = rowsLength.item(count) as never;
      const removed: HTMLDivElement = element.querySelector("div.grep-col") as never;
      if (removed) element.removeChild(removed);
      element.appendChild(divElement);
      element.style.position = "relative";
      addMouseListener(divElement, {
        reset: () =>
          table.querySelectorAll("thead > tr > th .grep-col").forEach((x) => {
            x.parentElement!.style.width = "auto";
          })
      });
    }
  }
};
