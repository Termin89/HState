import createState from "./createState";
import { describe, it, expect } from "vitest";
/**
 * createState - фабричный метод по созданию состояния
 */
describe('[TEST UTIL] "createState" ', () => {
  it("[Create State Success]", () => {
    const newState = createState("FIRST", {
      signals: {
        NEXT: "TWO_STATE",
        ERROR: "ERRORED",
      },
      type: "END",
    });
    expect(newState).toEqual({
      value: "FIRST",
      done: true,
      type: "END",
      previos: undefined,
    });
  });
});
