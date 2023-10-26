//@ts-nocheck
import { isValidSchema } from "./isValidSchema";
import { describe, it, expect } from "vitest";
/** Проверяем валидность схемы:
 *  0. --
 *      - schema в принцепе являеться обьектом
 *      - поле states - присутствует
 *      - поле states - являеться обьектом и в нем есть ключи
 *  1. initState:
 *      - присутствует ввиде string
 *      - являеться одним из ключей в поле states
 *  2. signals:
 *      - пройтись по каждому ключу и проверить ответ каждого ключа - они должны быть в подмножестве всех ключей из поля states
 *  3. states:
 *      - если есть поле signals - нужно провалидировать его по алгоритму 2 - и что он не пустой
 *      - если нет поля signals то обязательно должно быть поле type: со значением "END" - ото говорит о том что состояние конечное и нет в нем прееходов
 *
 */

import { Schema } from "../../types/main";

describe("[TEST UTIL ] isValidSchema", () => {
  it("No Valid schema.states", () => {
    const schemaAmptyStates: Schema<string, string> = {
      initState: "ONE",
      states: {},
    };
    const schemaNoObjStates: Schema<string, string> = {
      initState: "ONE",
      states: 12,
    };
    const schemaValisStates: Schema<string, string> = {
      initState: "ONE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
      },
    };
    const schemaUndefinedStates: Schema<string, string> = {
      initState: "ONE",
    };

    const schemaArray = [];

    const noValidAmpty = isValidSchema(schemaAmptyStates) instanceof Error;
    const noValidObject = isValidSchema(schemaNoObjStates) instanceof Error;
    const valid = isValidSchema(schemaValisStates);
    const statesUndefined =
      isValidSchema(schemaUndefinedStates) instanceof Error;
    const schemaNoObj = isValidSchema(schemaArray) instanceof Error;

    expect(noValidAmpty).toBeTruthy();
    expect(noValidObject).toBeTruthy();
    expect(valid).toBeTruthy();
    expect(statesUndefined).toBeTruthy();
    expect(schemaNoObj).toBeTruthy();
  });

  it("[initState]", () => {
    const undefinedInitState: Schema<string, string> = {
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
      },
    };
    const noStringInitState: Schema<string, string> = {
      initState: 123,
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
      },
    };
    const noValidString: Schema<string, string> = {
      initState: "THREE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
      },
    };
    const valid: Schema<string, string> = {
      initState: "ONE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
      },
    };
    expect(isValidSchema(undefinedInitState) instanceof Error).toBeTruthy();
    expect(isValidSchema(noStringInitState) instanceof Error).toBeTruthy();
    expect(isValidSchema(noValidString) instanceof Error).toBeTruthy();
    expect(isValidSchema(valid)).toBeTruthy();
  });

  it("[signals] Global", () => {
    const schemaValid: Schema<string, string> = {
      initState: "ONE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
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

    const noValidValue: Schema<string, string> = {
      initState: "ONE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
        ERRORED: {
          type: "END",
        },
      },
      signals: {
        ERROR: "NEXT",
      },
    };

    const noStringValue: Schema<string, string> = {
      initState: "ONE",
      states: {
        ONE: {
          signals: {
            NEXT: "TWO",
          },
        },
        TWO: {
          type: "END",
        },
        ERRORED: {
          type: "END",
        },
      },
      signals: {
        ERROR: [],
      },
    };

    expect(isValidSchema(schemaValid)).toBeTruthy();
    expect(isValidSchema(noValidValue) instanceof Error).toBeTruthy();
    expect(isValidSchema(noStringValue) instanceof Error).toBeTruthy();
  });

  describe("[states]", () => {
    it("[states valid structyre]", () => {
      const schemaValid: Schema<string, string> = {
        initState: "ONE",
        states: {
          ONE: {
            signals: {
              NEXT: "TWO",
            },
          },
          TWO: {
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
      const schemaSignalEmpty: Schema<string, string> = {
        initState: "ONE",
        states: {
          ONE: {
            signals: {},
          },
          TWO: {
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

      const schemaNoTypeEnd: Schema<string, string> = {
        initState: "ONE",
        states: {
          ONE: {
            signals: {
              NEXT: "TWO",
            },
          },
          TWO: {},
          ERRORED: {
            type: "END",
          },
        },
        signals: {
          ERROR: "ERRORED",
        },
      };
      expect(isValidSchema(schemaValid)).toBeTruthy();
      expect(isValidSchema(schemaSignalEmpty) instanceof Error).toBeTruthy();
      expect(isValidSchema(schemaNoTypeEnd) instanceof Error).toBeTruthy();
    });
  });
});
