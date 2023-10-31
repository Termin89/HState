import { describe, expect, it } from "vitest";
import { createSchema } from "./createSchema";
import { ErrorCreateSchema } from "../../Errors/ErrorCreateSchema";
/**
 * 0. при инициализации проверить валидность схемы:
 *      --[1] Неверный тип параметра или пустой
 *      --[2] При если только есть reference
 *          -- невалидный reference
 *              -- @add- добавить кейсов с валидацией всех компонентов схемы
 *                  -- signals
 *                  -- states
 *          -- валидный reference
 *
 *      --[3] Если есть mods
 *          -- проверить init
 *              -- нет init вовсе
 *              -- init - не валидный
 *              -- валидный init
 *          -- Валидность каждой из схемы mods
 *
 * 1. Проверка - chekout
 *      -- Если нет mods
 *
 *
 *
 */

describe("[TEST createSchema]", () => {
  const invalidReference = {
    states: {
      AUTH: {
        signals: {
          NEXT: "STEP",
        },
      },
      STEP: {
        signals: {
          NEXT: "DONE",
        },
      },
      DONE: {
        type: "END",
      },
    },
  };
  const validReference = {
    initState: "AUTH",
    states: {
      AUTH: {
        signals: {
          NEXT: "STEP",
        },
      },
      STEP: {
        signals: {
          NEXT: "DONE",
        },
      },
      DONE: {
        type: "END",
      },
    },
  };

  const validModSchema1 = {
    initState: "STEP",
  };
  const validModSchema2 = {
    states: {
      AUTH: {
        signals: {
          NEXT: "DONE",
        },
      },
    },
  };
  const noValidSchema1 = {
    states: {
      END: "END",
    },
  };
  const noValidModSchemaSetting = {
    init: "street",
    mods: {
      base: validModSchema1,
      street: noValidSchema1,
    },
  };
  const noInitSetting = {
    mods: {
      base: validModSchema1,
      street: validModSchema2,
    },
  };
  const noValidInitSetting = {
    ...noInitSetting,
    init: "DDD",
  };
  const validInitSetting = {
    mods: {
      base: validModSchema1,
      street: validModSchema2,
    },
    init: "base",
  };
  describe("[INIT]", () => {
    it("[Ampty Param][1]", () => {
      const param = {};
      const amptyParamSchema = createSchema(param);
      const noTypeParamSchema = createSchema("");
      const isErrorAmpty = amptyParamSchema instanceof ErrorCreateSchema;
      const isErrorParam = noTypeParamSchema instanceof ErrorCreateSchema;
      expect(isErrorAmpty).toBeTruthy();
      expect(isErrorParam).toBeTruthy();
    });
    it("[Invalid reference][2]", () => {
      const schemaError = createSchema({ reference: invalidReference });
      const schemaNoError = createSchema({ reference: validReference });

      const isErrorSchema = schemaError instanceof ErrorCreateSchema;
      const isValidSchema = !(schemaNoError instanceof ErrorCreateSchema);

      expect(isErrorSchema).toBeTruthy();
      expect(isValidSchema).toBeTruthy();
    });
    it("[Invalid mods.init][3]", () => {
      const paramNoInit = {
        reference: validReference,
        setting: noInitSetting,
      };
      const paramInvalidInit = {
        reference: validReference,
        setting: noValidInitSetting,
      };
      const errorSchemaNoInit = createSchema(paramNoInit);
      const errorSchemaInvalidInit = createSchema(paramInvalidInit);
      const isErrorSchemaNoInit =
        errorSchemaNoInit instanceof ErrorCreateSchema;
      const isErrorSchemaInvalidInit =
        errorSchemaInvalidInit instanceof ErrorCreateSchema;
      expect(isErrorSchemaNoInit).toBeTruthy();
      expect(isErrorSchemaInvalidInit).toBeTruthy();
    });
    it("[valid mods.init][3]", () => {
      const param = {
        reference: validReference,
        setting: validInitSetting,
      };
      const schema = createSchema(param);
      const isInitState = !!schema.value().initState;
      expect(isInitState).toBeTruthy();
    });
    it("[invalid mods schema][3]", () => {
      const param = {
        reference: validReference,
        setting: noValidModSchemaSetting,
      };

      const errorSchema = createSchema(param);
      const isError = errorSchema instanceof ErrorCreateSchema;
      expect(isError).toBeTruthy();
    });
  });
});
