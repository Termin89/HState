import createState from "./createState";

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
