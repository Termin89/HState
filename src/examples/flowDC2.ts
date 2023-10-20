import { Schema, StatesOptions } from "..";

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

const signals = ["ERROR", "REJECT", "NEXT", "SELECT", "TO_MK", "CALL"] as const;

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
    WRITE_SMS: {
      signals: {
        NEXT: "PASSPORT_FULL",
        ERROR: "WRITE_SMS",
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
  },
  signals: {
    ERROR: "ERRORED",
    REJECT: "REJECTED",
    TO_MK: "MK",
    CALL: "CALLING",
  },
};

const streetModSchema: Schema<TargetName, SignalName> = {
  initState: "AUTH",
  states: {
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
  },
};

