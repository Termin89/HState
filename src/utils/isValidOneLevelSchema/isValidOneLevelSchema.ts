import { SchemaOneLevel } from "../../types/main";

export function isValidOneLevelSchema<T extends string, S extends string>(
  schema: SchemaOneLevel<T, S>
) {
  if (!isObject(schema)) {
    const error = new Error(`Схема не являеться обьектом: ${schema}`);
    error.name = "NO_OBJECT_SCHEMA";
  }
  const statesKeys = schema.states ? Object.keys(schema.states) : [];

  if (!(isObject(schema.states) && statesKeys.length)) {
    const error = new Error(
      `Поле states не являеться обьектом или в нем нет ключей его значение: ${schema.states}`
    );
    error.name = "NO_OBJECT_STATES";
    return error;
  }
  //   initState
  if (
    !(
      typeof schema.initState === "string" &&
      isValidInitState(schema.initState, statesKeys)
    )
  ) {
    const error = new Error(
      `initState не валидное значение: ${schema.initState}`
    );
    error.name = "NO_VALID_INIT_STATE";
    return error;
  }
  //
  //    signals
  if (!(schema.signals && isObject(schema.signals))) {
    const error = new Error(
      `Поле sinnals не являеться обьектом или в нем нет ключей его значение: ${schema.states}`
    );
    error.name = "NO_OBJECT_SIGNALS";
    return error;
  }

  if (
    schema.signals &&
    !isValidSignals(statesKeys, schema.signals as Record<string, string>)
  ) {
    const error = new Error(
      `Значение сигналов: ${schema.signals} не пересекаються с состояниями: ${schema.states}`
    );
    error.name = "NO_VALID_SIGNALS";
    return error;
  }
  //
  // states - signals
  const statesValue = Object.values(schema.states);
  if (
    !isStatesValid(statesValue as Array<Record<string, unknown>>, statesKeys)
  ) {
    const error = new Error(
      `Обьект states: ${schema.states} не валиден - проверте сигналы или если это конечное состояние наличае type: "END"`
    );
    error.name = "NO_VALID_SIGNALS";
    return error;
  }
  //

  statesValue;

  return true;
}

function isObject(obj: object) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function isValidInitState(initState: string, states: Array<string>) {
  return states.includes(initState);
}

function isValidSignals(
  statesKeys: Array<string>,
  signals: Record<string, string>
) {
  return (
    Object.values(signals).every((signal) => statesKeys.includes(signal)) &&
    isNoAmptyObj(signals as any)
  );
}

function isNoAmptyObj(obj: Record<string, unknown>) {
  return !!Object.keys(obj).length;
}

function isStatesValid(
  states: Array<Record<string, unknown>>,
  statesKeys: Array<string>
) {
  const isValidsSignals = states
    .filter((state) => state.signals)
    .every((state) =>
      isValidSignals(statesKeys, state.signals as Record<string, string>)
    );
  const isEndTypes = states
    .filter((state) => !state.signals)
    .every((state) => state.type === "END");
  return isValidsSignals && isEndTypes;
}
