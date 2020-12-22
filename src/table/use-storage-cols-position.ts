import { parse, stringify } from "flatted";
import { isNil } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TableColumns } from "./types";

const getNoCircular = <T>(key: string): T => {
  const item = window.localStorage.getItem(key);
  try {
    if (isNil(item)) {
      return item as never;
    }
    return parse(item);
  } catch (error) {
    return item as never;
  }
};

const setNoCircular = <T>(key: string, object: T) => {
  const item = stringify(object);
  window.localStorage.setItem(key, item);
};

type StorageColsPosition<T> = {
  columns: TableColumns<T>;
  set: (t: TableColumns<T>) => void;
  reset: () => void;
};
export const useStorageColsPosition = <T>(
  columns: TableColumns<T>,
  storageKey: string,
  getStorage = getNoCircular,
  setStorage = setNoCircular
): StorageColsPosition<T> => {
  const [initial] = useState(() => columns);
  const [tableCols, setTableCols] = useState(
    (): TableColumns<T> => {
      const list: TableColumns<T> = getStorage(storageKey) as never;
      const saved = () => {
        setStorage(storageKey, columns);
        return columns;
      };
      if (Array.isArray(list) && list.length === columns.length) {
        const dataTitleDict = columns.reduce((acc, el) => {
          const key = (el as any)["data-title"];
          return { ...acc, [key]: el };
        }, {});
        const newList: any[] = [];
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          const dataTitle = (element as any)["data-title"];
          if (!(dataTitle in dataTitleDict)) {
            return saved();
          }
          newList.push((dataTitleDict as any)[dataTitle] as any);
        }
        return newList;
      }
      return saved();
    }
  );

  const saveTableColumns = useCallback(
    (tc: TableColumns<T>) => {
      setTableCols(tc);
      setStorage(storageKey, tc);
    },
    [setStorage, storageKey]
  );

  useEffect(() => {
    if (initial === columns) {
      return;
    }
    saveTableColumns(columns);
  }, [columns, saveTableColumns, initial]);

  const reset = useCallback(() => {
    saveTableColumns(initial);
  }, [initial, saveTableColumns]);

  const result = useMemo(
    () => ({
      set: saveTableColumns,
      columns: tableCols,
      reset,
    }),
    [reset, saveTableColumns, tableCols]
  );

  return result;
};
