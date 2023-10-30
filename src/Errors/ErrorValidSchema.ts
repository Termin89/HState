import { ErrorApp } from "./ErrorApp";

const NAME = "isValidSchema ERROR";

export enum codesErrorValidSchema {
  SCHEMA_TYPE = 1000,
  STATES_TYPE = 2000,
  STATES_INVALID_SIGNALS = 2001,
  INIT_TYPE = 3000,
  INIT_INVALID = 3001,
  SIGNALS_TYPE = 4000,
  SIGNALS_INVALID = 4001,
}

const codeMap = {
  [codesErrorValidSchema.SCHEMA_TYPE]: "invalid type schema",
  [codesErrorValidSchema.STATES_TYPE]: "invalid type states",
  [codesErrorValidSchema.STATES_INVALID_SIGNALS]: "invalid signals in states",
  [codesErrorValidSchema.INIT_TYPE]: "invalid type initStates",
  [codesErrorValidSchema.INIT_INVALID]: "invalid initState",
  [codesErrorValidSchema.SIGNALS_TYPE]: "invalid type signals",
  [codesErrorValidSchema.SIGNALS_INVALID]: "invalid signals",
};

export class ErrorValidSchema extends ErrorApp<codesErrorValidSchema> {
  constructor(code: codesErrorValidSchema, detailsMessage?: string) {
    super({
      code,
      map: codeMap,
      name: NAME,
      msg: detailsMessage,
    });
  }
}
