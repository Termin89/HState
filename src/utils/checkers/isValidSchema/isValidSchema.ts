import { Schema } from "@/types/main";
import {
  isNoAmptyObj,
  isObject,
  isStatesValid,
  isValidInitState,
  isValidSignals,
} from "..";
/**
 *  [1] - schema            - не обьект     - Error
 *  [2] - schema            - Пустой обьект - Error
 *  [3] - schema.states     - не обьект     - Error
 *  [4] - schema.states     - Пустой обьект - Error
 *  [5] - schema.initState  - это не string - Error
 *  [6] - schema.initState  - нет такого состояния - Error
 *  [7] - schema.signals    - если в схеме но обьект - Error
 *  [8] - schema.signals    - не валидные значения - Error
 *  [9] - schema.states     - не валидные значения в signals - Error
 */

export function isValidSchema<T extends string, S extends string>(
  schema: Schema<T, S>
) {
  // [1][2]
  if (!isObject(schema) || !isNoAmptyObj(schema)) {
    const error = new Error(
      `Схема не являеться обьектом или пустой объект: ${schema}`
    );
    error.name = "NO_OBJECT_SCHEMA";
  }
  // ----

  const statesKeys = schema.states ? Object.keys(schema.states) : [];

  // [3][4]
  if (!(isObject(schema.states) && isNoAmptyObj(schema.states))) {
    const error = new Error(
      `Поле states не являеться обьектом или в нем нет ключей его значение: ${schema.states}`
    );
    error.name = "NO_OBJECT_STATES";
    return error;
  }
  // -----

  // [5][6]
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
  // ---
  // [7]
  if (!(schema.signals && isObject(schema.signals))) {
    const error = new Error(
      `Поле sinnals не являеться обьектом или в нем нет ключей его значение: ${schema.states}`
    );
    error.name = "NO_OBJECT_SIGNALS";
    return error;
  }
  // [8]
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
  //------
  // [9]
  if (
    !isStatesValid(
      Object.values(schema.states) as Array<Record<string, unknown>>,
      statesKeys
    )
  ) {
    const error = new Error(
      `Обьект states: ${schema.states} не валиден - проверте сигналы или если это конечное состояние наличае type: "END"`
    );
    error.name = "NO_VALID_SIGNALS";
    return error;
  }
  //

  return true;
}
