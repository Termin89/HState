//@ts-nocheck
import createMachine from "./createMachine";
import { Schema } from "@/types/main";
import { describe, it, expect } from "vitest";
/**
 * 0. Валидность Schema- все кейсы валидности schema
 *
 * 1. Инициализация - init(state)
 *      - ERROR - при повторной инициализации
 *      - ERROR - Если при инициализации нет схемы для данного состояния(state - в аргументах init)
 *      - Инициализируемся из state - если нет state то из initState - из схемы
 *
 * 2. Переход - transition(state, signal)
 *      - ERROR - Если машина все еще не проинициализирована
 *      - ERROR - Если машина находиться в конечном состоянии - переходов нет
 *      - VALID - валидный переход, проверить:
 *          - context.value - это новое ожидаемое состояние
 *          - context.history - история переходов
 * 3. @-add Проверка волидации схемы - нужно придумать
 *
 * */

describe("[TEST Machine] - createMachine", () => {
  const states = ["FIRST", "NEXTED", "DONED", "ERRORED"] as const;
  const signals = ["NEXT", "ERROR"] as const;
  const schema: Schema<(typeof states)[number], (typeof signals)[number]> = {
    initState: "FIRST",
    states: {
      FIRST: {
        signals: {
          NEXT: "NEXTED",
        },
      },
      NEXTED: {
        signals: {
          NEXT: "DONED",
        },
      },
      DONED: {
        type: "END",
      },
      ERRORED: {
        type: "END",
      },
    },
    signals: {
      ERROR: "ERRORED",
    },
  };
  describe("1. [init()]", () => {
    it("[ERROR] - reInit", () => {
      const machineForInit1 = createMachine(schema);
      const isNoErrorMashine = !(machineForInit1 instanceof Error);
      expect(isNoErrorMashine).toBeTruthy();

      const init1 = machineForInit1.init();
      const init2ERROR = machineForInit1.init();

      const isState = init1 !== undefined && !(init1 instanceof Error);
      const isError = init2ERROR instanceof Error;
      expect(isState).toBeTruthy();
      expect(isError).toBeTruthy();
      expect(init2ERROR.name).toBe("INITED");
    });
    it("[ERROR] - No Schema State", () => {
      const initState = {
        value: "NEXTED1",
      };
      const machineForInit2 = createMachine(schema);
      const initError = machineForInit2.init(initState);
      const isError = initError instanceof Error;
      expect(isError).toBeTruthy();
      expect(initError.name).toBe("INIT_SCHEMA");
    });
    it("[VALID] success init checked context", () => {
      const mashineForInit3 = createMachine(schema);
      const expectedContext = {
        isInit: true,
        name: undefined,
        schema: schema,
      };
      const machineIsNoError = !(mashineForInit3 instanceof Error);
      expect(machineIsNoError).toBeTruthy();
      const init = mashineForInit3.init();
      const isState = init && !(init instanceof Error);
      expect(isState).toBeTruthy();
      expect(mashineForInit3.context).toEqual(expectedContext);
    });
  });
  describe("2. [transition()]", () => {
    it("[ERROR] no init", () => {
      const mashineForTransition1 = createMachine(schema);
      const transitionERROR = mashineForTransition1.transition();

      const isError = transitionERROR instanceof Error;
      expect(isError).toBeTruthy();
      expect(transitionERROR.name).toBe("NO_INIT");
    });
    it("[ERROR] is done mashine", () => {
      const mashineForTransition2 = createMachine(schema);
      const stateDoned = {
        value: "DONED",
        done: true,
      };
      const init = mashineForTransition2.init(stateDoned);
      const isState = init && !(init instanceof Error);
      expect(isState).toBeTruthy();
      const transitionERROR = mashineForTransition2.transition(
        stateDoned,
        "ERROR"
      );
      const isError = transitionERROR instanceof Error;
      expect(isError).toBeTruthy();
      expect(transitionERROR.name).toBe("IS_DONE");
    });
    it("[VALID] success transition", () => {
      const mashineForTransition3 = createMachine(schema);
      const init = mashineForTransition3.init();
      const isState = init && !(init instanceof Error);
      expect(isState).toBeTruthy();
      const transition = mashineForTransition3.transition(
        { value: "FIRST" },
        "NEXT"
      );
      const isNewState = transition && !(transition instanceof Error);
      expect(isNewState).toBeTruthy;
      expect(transition.value).toBe("NEXTED");
    });
  });
});
