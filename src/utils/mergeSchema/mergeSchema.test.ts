import { describe, expect, it } from "vitest";
import { mergeSchema } from "./mergeSchema";
/**
 * [1] - Создаеться новый обьект где
 *      -- первый аргумент это reference схема в которую будут вмердживаться данные из последующих аргументов
 *      -- глубокое вмердживание т.е. если значение обьект то мерджим и его знаение рекурсивно проваливаясть
 *      -- если поле "states" каждый state у reference - подменяеться state из обьектов других аргументов
 *
 */
describe("", () => {
  //   it("valid merge", () => {
  //     const obj1 = {
  //       initState: "auth",
  //       states: {
  //         auth: {
  //           signals: {
  //             next: "step",
  //           },
  //         },
  //         step: {
  //           signals: {
  //             next: "done",
  //           },
  //         },
  //         done: {
  //           type: "end",
  //         },
  //       },
  //     };
  //     const obj2 = {
  //       initState: "step",
  //       states: {
  //         auth: {
  //           signals: {
  //             next: "done",
  //             error: "error",
  //           },
  //         },
  //         error: {
  //           type: "end",
  //         },
  //       },
  //     };

  //     const expectObj = {
  //       initState: "step",
  //       states: {
  //         auth: {
  //           signals: {
  //             next: "done",
  //             error: "error",
  //           },
  //         },
  //         step: {
  //           signals: {
  //             next: "done",
  //           },
  //         },
  //         done: {
  //           type: "end",
  //         },
  //         error: {
  //           type: "end",
  //         },
  //       },
  //     };
  //     const result = merge({}, obj1, obj2);
  //     expect(result).toEqual(expectObj);

  //   });

  it("valid mergedSchema", () => {
    const reference = {
      initState: "auth",
      states: {
        auth: {
          signals: {
            next: "step",
          },
        },
        step: {
          signals: {
            next: "done",
          },
        },
        done: {
          type: "end",
        },
      },
    };

    const mod1 = {
      initState: "step",
      states: {
        auth: {
          signals: {
            reject: "error",
          },
        },
      },
      signals: {
        error: "error",
      },
    };

    const expected = {
      initState: "step",
      states: {
        auth: {
          signals: {
            reject: "error",
          },
        },
        step: {
          signals: {
            next: "done",
          },
        },
        done: {
          type: "end",
        },
      },
      signals: {
        error: "error",
      },
    };

    const result = mergeSchema(reference, mod1);
    expect(result).toEqual(expected);
  });
});
