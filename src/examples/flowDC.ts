import createActor from '@/functions/createActor/createActor';
import createOneLevelMachine from '@/functions/createOneLevelMashine/createOneLevelMachine';
import { SchemaOneLevel } from '@/types/main';

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
  "NEXT_BASE",
  "CHANGE_BASE",
  "IN_VALID_CODE",
  "SELECT",
  "TO_MK",
  "CALL",
] as const;

type TargetName = (typeof states)[number];
type SignalName = (typeof signals)[number];

export const schemaDC: SchemaOneLevel<TargetName, SignalName> = {
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
        NEXT_BASE: "PASSPORT_NUMBER",
        ERROR: "WRITE_SMS",
      },
    },
    PASSPORT_FULL: {
      signals: {
        NEXT: "DELIVERY",
      },
    },
    PASSPORT_NUMBER: {
      signals: {
        NEXT: "CODE_WORD",
        CHANGE_BASE: "PASSPORT_FULL",
      },
    },
    CODE_WORD: {
      signals: {
        IN_VALID_CODE: "PASSPORT_FULL",
        NEXT: "DELIVERY",
        SELECT: "SELECT_CARD",
      },
    },
    DELIVERY: {
      signals: {
        NEXT: "DONED",
        CALL: "CALLING",
      },
    },
    SELECT_CARD: {
      signals: {
        NEXT: "DELIVERY",
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

const mashineDC = createOneLevelMachine(schemaDC)
// createOneLevelMachine - может вернуть ERROR - поэтому сразу рекомендуеться обработать 
// эту ошибку и уверенно использовать API уже после обработки ошибки - инаде даже IDE не подсветит подсказки
if(mashineDC instanceof Error) throw new Error('mashineDC of Error')

const flowDC = createActor(mashineDC)
// createActor - может вернуть ERROR - поэтому сразу рекомендуеться обработать 
// эту ошибку и уверенно использовать API уже после обработки ошибки - инаде даже IDE не подсветит подсказки
if(flowDC instanceof Error) throw new Error('flowDC of Error')
flowDC.start('AUTH')


