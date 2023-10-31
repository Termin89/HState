import { ErrorApp } from "@/Errors/ErrorApp";

const NAME = "createSchema ERROR";

export enum codesErrorCreateSchema {
  PARAM_TYPE = 1000,
  PARAM_AMPTY = 1001,
  INVALID_REFERENCE = 2000,
  INVALID_MODS = 2001,
  NO_INIT = 2002,
  INVALID_INIT = 2003,
  CHECKOUT_NONE_MODS = 3000,
  CHECKOUT_MISS_MOD = 3001,
}

const codeMap = {
  [codesErrorCreateSchema.PARAM_TYPE]: "param invalid type",
  [codesErrorCreateSchema.PARAM_AMPTY]: "param is ampty",
  [codesErrorCreateSchema.INVALID_REFERENCE]: "invalid reference schema",
  [codesErrorCreateSchema.INVALID_MODS]: "invalid mods schems",
  [codesErrorCreateSchema.NO_INIT]: "no init in param.setting",
  [codesErrorCreateSchema.INVALID_INIT]: "init param no valid for mods",
  [codesErrorCreateSchema.CHECKOUT_NONE_MODS]: "checkout() - none mods",
  [codesErrorCreateSchema.CHECKOUT_MISS_MOD]: "checkout() - missing mod ",
} as const;

export class ErrorCreateSchema extends ErrorApp<codesErrorCreateSchema> {
  constructor(code: codesErrorCreateSchema, detailsMessage?: string) {
    super({
      code,
      map: codeMap,
      name: NAME,
      msg: detailsMessage,
    });
  }
}
