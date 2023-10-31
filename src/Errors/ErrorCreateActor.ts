import { ErrorApp } from "./ErrorApp";

const NAME = "createActor ERROR";

export enum codesErrorCreateActor {
  NO_START = 1000,
  NO_ACTYAL_STATE = 1001,
  MASHINE = 2000,
  MASHINE_INIT = 2001,
  MASHINE_TRANSITION = 2002,
  NO_STATE_SCHEMA = 3000,
  STATE_DONE = 4001,
}

const codeMap = {
  [codesErrorCreateActor.MASHINE]: "mashine error",
  [codesErrorCreateActor.NO_STATE_SCHEMA]: "no state schema",
  [codesErrorCreateActor.MASHINE_INIT]: "mashine init",
  [codesErrorCreateActor.STATE_DONE]: "no schema in state",
  [codesErrorCreateActor.NO_START]: "actor no ready start",
  [codesErrorCreateActor.NO_ACTYAL_STATE]: "no actyal state",
  [codesErrorCreateActor.MASHINE_TRANSITION]: "mashine transition error",
};
export class ErrorCreateActor extends ErrorApp<codesErrorCreateActor> {
  constructor(code: codesErrorCreateActor, detailsMessage?: string) {
    super({
      code,
      map: codeMap,
      name: NAME,
      msg: detailsMessage,
    });
  }
}
