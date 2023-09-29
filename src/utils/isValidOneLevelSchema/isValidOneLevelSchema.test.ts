//@ts-nocheck
import { isValidOneLevelSchema } from "./isValidOneLevelSchema";
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

import { SchemaOneLevel } from "../../types/main";

describe("[TEST UTIL ] isValidOneLevelSchema", () => {
  it("No Valid schema.states", () => {
    const schemaAmptyStates: SchemaOneLevel<string, string> = {
      initState: "ONE",
      states: {},
    };
    const schemaNoObjStates: SchemaOneLevel<string, string> = {
      initState: "ONE",
      states: 12,
    };
    const schemaValisStates: SchemaOneLevel<string, string> = {
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
    const schemaUndefinedStates: SchemaOneLevel<string, string> = {
      initState: "ONE",
    };

    const schemaArray = [];

    const noValidAmpty =
      isValidOneLevelSchema(schemaAmptyStates) instanceof Error;
    const noValidObject =
      isValidOneLevelSchema(schemaNoObjStates) instanceof Error;
    const valid = isValidOneLevelSchema(schemaValisStates);
    const statesUndefined =
      isValidOneLevelSchema(schemaUndefinedStates) instanceof Error;
    const schemaNoObj = isValidOneLevelSchema(schemaArray) instanceof Error;

    expect(noValidAmpty).toBeTruthy();
    expect(noValidObject).toBeTruthy();
    expect(valid).toBeTruthy();
    expect(statesUndefined).toBeTruthy();
    expect(schemaNoObj).toBeTruthy();
  });

  it("[initState]", () => {
    const undefinedInitState: SchemaOneLevel<string, string> = {
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
    const noStringInitState: SchemaOneLevel<string, string> = {
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
    const noValidString: SchemaOneLevel<string, string> = {
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
    const valid: SchemaOneLevel<string, string> = {
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
    expect(
      isValidOneLevelSchema(undefinedInitState) instanceof Error
    ).toBeTruthy();
    expect(
      isValidOneLevelSchema(noStringInitState) instanceof Error
    ).toBeTruthy();
    expect(isValidOneLevelSchema(noValidString) instanceof Error).toBeTruthy();
    expect(isValidOneLevelSchema(valid)).toBeTruthy();
  });

  it("[signals] Global", () => {
    const schemaValid: SchemaOneLevel<string, string> = {
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

    const noValidValue: SchemaOneLevel<string, string> = {
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

    const noStringValue: SchemaOneLevel<string, string> = {
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

    expect(isValidOneLevelSchema(schemaValid)).toBeTruthy();
    expect(isValidOneLevelSchema(noValidValue) instanceof Error).toBeTruthy();
    expect(isValidOneLevelSchema(noStringValue) instanceof Error).toBeTruthy();
  });

  describe("[states]", () => {
    it("[states valid structyre]", () => {
      const schemaValid: SchemaOneLevel<string, string> = {
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
      const schemaSignalEmpty: SchemaOneLevel<string, string> = {
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

      const schemaNoTypeEnd: SchemaOneLevel<string, string> = {
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
      expect(isValidOneLevelSchema(schemaValid)).toBeTruthy();
      expect(
        isValidOneLevelSchema(schemaSignalEmpty) instanceof Error
      ).toBeTruthy();
      expect(
        isValidOneLevelSchema(schemaNoTypeEnd) instanceof Error
      ).toBeTruthy();
    });
  });
});
