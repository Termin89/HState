//@ts-nocheck
import { SchemaOneLevel, State } from "@/types/main";
import getNewState from "./getNewState";
import { describe, it, expect } from "vitest";
/**
 * getNewState - чистая функция которая возвращает следующее состояние из схемы по сигналу
 *
 */
describe('[TEST UTIL] "getNewState"', () => {
  const states = ["FIRST", "TWO", "INFO", "END", "ERRORED", "NOVALID"] as const;
  const signals = ["NEXT", "ERROR"] as const;
  const schema: SchemaOneLevel<
    (typeof states)[number],
    (typeof signals)[number]
  > = {
    initState: "FIRST",
    states: {
      FIRST: {
        signals: {
          NEXT: "TWO",
        },
      },
      TWO: {
        signals: {
          NEXT: "INFO",
        },
      },
      INFO: {
        signals: {
          NEXT: "END",
        },
      },
      END: {
        type: "END",
      },
      ERRORED: {
        type: "END",
      },
      NOVALID: {
        signals: {
          NEXT: "BOOO",
        },
      },
    },
    signals: {
      ERROR: "ERRORED",
    },
  };

  it("[Valid next state]", () => {
    const state: State<(typeof states)[number]> = {
      value: "FIRST",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const expectedState: State<(typeof states)[number]> = {
      value: "TWO",
      type: undefined,
      previos: state,
      done: false,
    };

    const newState = getNewState(schema, state, "NEXT");

    expect(newState).toEqual(expectedState);
  });

  it("[Valid next state whis target signal]", () => {
    const state: State<(typeof states)[number]> = {
      value: "TWO",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const expectedState: State<(typeof states)[number]> = {
      value: "INFO",
      type: undefined,
      previos: state,
      done: false,
    };

    const newState = getNewState(schema, state, "NEXT");
    expect().toBeUndefined();
  });

  it("[Valid next state error]", () => {
    const state: State<(typeof states)[number]> = {
      value: "FIRST",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const expectedState: State<(typeof states)[number]> = {
      value: "ERRORED",
      type: "END",
      previos: state,
      done: true,
    };

    const newState = getNewState(schema, state, "ERROR");
    expect(newState).toEqual(expectedState);
  });

  it("[Error No Schema Signal]", () => {
    const state: State<(typeof states)[number]> = {
      value: "FIRST",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const newState = getNewState(schema, state, "NEXT_NO");
    const isError = newState instanceof Error;
    const isErrorSignal = newState.name === "ERROR_SIGNAL";

    expect(isError).toBeTruthy();
    expect(isErrorSignal).toBeTruthy();
  });

  it("[Error No Schema State]", () => {
    const state: State<(typeof states)[number]> = {
      value: "Bingo",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const newState = getNewState(schema, state, "NEXT");
    const isError = newState instanceof Error;
    const isErrorSignal = newState.name === "ERROR_STATE";

    expect(isError).toBeTruthy();
    expect(isErrorSignal).toBeTruthy();
  });

  it("[Error No Schema New State]", () => {
    const state: State<(typeof states)[number]> = {
      value: "NOVALID",
      previos: undefined,
      done: false,
      type: undefined,
    };

    const newState = getNewState(schema, state, "NEXT");
    const isError = newState instanceof Error;
    const isErrorSignal = newState.name === "ERROR_NEW_STATE";

    expect(isError).toBeTruthy();
    expect(isErrorSignal).toBeTruthy();
  });
});
