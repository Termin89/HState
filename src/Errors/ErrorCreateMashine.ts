import { ErrorApp } from "./ErrorApp";

const NAME = "createMashine ERROR";

export enum codesErrorCreateMashine {
  ALREDY_INIT = 1000,
  NO_INIT = 1001,
  STATE_SCHEMA = 2000,
  STATE_DONE = 2001,
}

const codeMap = {
  [codesErrorCreateMashine.ALREDY_INIT]: "already init mashine",
  [codesErrorCreateMashine.NO_INIT]: "no init mashine",
  [codesErrorCreateMashine.STATE_SCHEMA]: "no schema in state",
  [codesErrorCreateMashine.STATE_DONE]: "no schema in state",
};
export class ErrorCreateMashine extends ErrorApp<codesErrorCreateMashine> {
  constructor(code: codesErrorCreateMashine, detailsMessage?: string) {
    super({
      code,
      map: codeMap,
      name: NAME,
      msg: detailsMessage,
    });
  }
}
