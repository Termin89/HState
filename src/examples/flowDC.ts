import { ModeSchema } from "@/types/main";
import { Schema, createActor, createMachine } from "..";
import createSchema from "@/functions/createSchema/createSchema";

const states = [
  "AUTH",
  "WRITE_SMS",
  "PASSPORT_FULL",
  "PASSPORT_NUMBER",
  "CODE_WORD",
  "DELIVERY",
  "MK",
  "REJECTED",
  "DONED",
  "CALLING",
] as const;

const signals = ["REJECT", "NEXT", "ERROR", "NO_VALID"] as const;

const mods = ["base", "street"] as const;

type TargetName = (typeof states)[number];
type SignalName = (typeof signals)[number];
type ModeNames = (typeof mods)[number];

const reference: Schema<TargetName, SignalName> = {
  initState: "AUTH",
  states: {
    AUTH: {
      signals: {
        ERROR: "AUTH",
        NEXT: "WRITE_SMS",
      },
    },
    PASSPORT_FULL: {
      signals: {
        NEXT: "DELIVERY",
      },
    },
    DELIVERY: {
      signals: {
        NEXT: "DONED",
        ERROR: "CALLING",
      },
    },
    REJECTED: {
      type: "END",
    },
    MK: {
      type: "END",
    },
    CALLING: {
      type: "END",
    },
    DONED: {
      type: "END",
    },
    WRITE_SMS: {
      type: "CLOSE",
    },
    PASSPORT_NUMBER: {
      type: "CLOSE",
    },
    CODE_WORD: {
      type: "CLOSE",
    },
  },
  signals: {
    ERROR: "CALLING",
    REJECT: "REJECTED",
  },
};

const street: ModeSchema<TargetName, SignalName> = {
  states: {
    WRITE_SMS: {
      signals: {
        NEXT: "PASSPORT_FULL",
        ERROR: "WRITE_SMS",
      },
    },
  },
};

const base: ModeSchema<TargetName, SignalName> = {
  states: {
    WRITE_SMS: {
      signals: {
        NEXT: "PASSPORT_NUMBER",
        ERROR: "WRITE_SMS",
      },
    },
    PASSPORT_NUMBER: {
      signals: {
        NEXT: "CODE_WORD",
        NO_VALID: "PASSPORT_FULL",
      },
    },
    CODE_WORD: {
      signals: {
        NEXT: "DELIVERY",
        NO_VALID: "PASSPORT_FULL",
      },
    },
  },
};

const schema = createSchema({
  reference,
  setting: {
    init: "street",
    mods: {
      base,
      street,
    },
  },
});
if (schema instanceof Error) throw schema;

const mashineDC = createMachine(schema);
if (mashineDC instanceof Error) throw mashineDC;

const actorDC = createActor(mashineDC);
if (actorDC instanceof Error) throw actorDC;

actorDC.start();

actorDC.send("NEXT");
schema.checkout("base");
actorDC.send("NEXT");
