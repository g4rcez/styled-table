import { DependencyList, useMemo } from "react";

type ClassArray = ClassValue[];

type ClassDictionary = { [id: string]: any };

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

const words = (s: string | number) => `${s}`.split(" ");

const classNames = (...classes: ClassValue[]): string => {
  if (classes.length === 0) {
    return "";
  }
  const array: Set<string> = new Set<string>();
  classes.forEach((c) => {
    const type = typeof c;
    if (type === "string" || type === "number") {
      return words(c as string).forEach((s) => array.add(s));
    }
    if (type === "object") {
      for (const key in c as any) {
        if ((c as any)[key]) {
          words(key).forEach((s) => array.add(s));
        }
      }
    }
    if (Array.isArray(c)) {
      c.forEach((x) => array.add(classNames(x)));
    }
  });
  return [...array.values()].join(" ");
};

export const useClassNames = (dependency: DependencyList, ...classes: ClassValue[]) => {
  const className = useMemo(() => classNames(...classes), dependency);
  return className;
};
