import { ModeSchema } from "@/types/main";
import { Schema } from "..";

const states = [
  "AUTH",
  "WRITE_SMS",
  "PASSPORT_FULL",
  "PASSPORT_NUMBER",
  "CODE_WORD",
  "DELIVERY",
  "SELECT_CARD",
  "MK",
  "ERRORED",
  "REJECTED",
  "DONED",
  "CALLING",
] as const;

const signals = [
  "ERROR",
  "REJECT",
  "NEXT",
  "SELECT",
  "NO_VALID",
  "TO_MK",
  "CALL",
] as const;

type TargetName = (typeof states)[number];
type SignalName = (typeof signals)[number];

const generalSchema: Schema<TargetName, SignalName> = {
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
        CALL: "CALLING",
      },
    },
    ERRORED: {
      type: "END",
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
    SELECT_CARD: {
      type: "CLOSE",
    },
  },
  signals: {
    ERROR: "ERRORED",
    REJECT: "REJECTED",
    TO_MK: "MK",
    CALL: "CALLING",
  },
};

const streetModSchema: ModeSchema<TargetName, SignalName> = {
  states: {
    WRITE_SMS: {
      signals: {
        NEXT: "PASSPORT_FULL",
        ERROR: "WRITE_SMS",
      },
    },
  },
};

const baseModSchema: ModeSchema<TargetName, SignalName> = {
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
        NO_VALID: "PASSPORT_FULL",
        SELECT: "SELECT_CARD",
        NEXT: "DELIVERY",
      },
    },
  },
};
