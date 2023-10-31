import { Schema } from "@/types/main";
import {
  isNoAmptyObj,
  isObject,
  isStatesValid,
  isValidInitState,
  isValidSignals,
} from "..";
import {
  ErrorValidSchema,
  codesErrorValidSchema,
} from "@/Errors/ErrorValidSchema";
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
  if (!isObject(schema) || !isNoAmptyObj(schema))
    return new ErrorValidSchema(
      codesErrorValidSchema.SCHEMA_TYPE,
      `Схема не являеться обьектом или пустой объект: ${schema}`
    );
  // ----

  const statesKeys = schema.states ? Object.keys(schema.states) : [];

  // [3][4]
  if (!(isObject(schema.states) && isNoAmptyObj(schema.states)))
    return new ErrorValidSchema(
      codesErrorValidSchema.STATES_TYPE,
      `Поле states не являеться обьектом или в нем нет ключей его значение: ${schema.states}`
    );

  // -----

  // [5]
  if (!(typeof schema.initState === "string"))
    return new ErrorValidSchema(
      codesErrorValidSchema.INIT_TYPE,
      `Не правильный тип initState = ${schema.initState}`
    );
  // [6]
  if (!isValidInitState(schema.initState, statesKeys))
    return new ErrorValidSchema(
      codesErrorValidSchema.INIT_INVALID,
      `Не валидный тип initState = ${schema.initState}`
    );
  // ---
  // [7]
  if (
    schema.signals &&
    (!isObject(schema.signals) || !isNoAmptyObj(schema.signals))
  )
    return new ErrorValidSchema(
      codesErrorValidSchema.SIGNALS_TYPE,
      `Поле sinnals не являеться обьектом или в нем нет ключей его значение: ${JSON.stringify(
        schema.states
      )}`
    );
  // [8]
  if (
    schema.signals &&
    !isValidSignals(statesKeys, schema.signals as Record<string, string>)
  )
    return new ErrorValidSchema(
      codesErrorValidSchema.SIGNALS_INVALID,
      `Значение сигналов: ${schema.signals} не пересекаються с состояниями: ${schema.states}`
    );
  //------
  // [9]
  if (
    !isStatesValid(
      Object.values(schema.states) as Array<Record<string, unknown>>,
      statesKeys
    )
  )
    return new ErrorValidSchema(
      codesErrorValidSchema.STATES_INVALID_SIGNALS,
      `Обьект states: ${schema.states} не валиден - проверте сигналы или если это конечное состояние наличае type: "END"`
    );
  //

  return true;
}
