import { Schema, ModeSchema, createReadonly } from "@/index";
import { isValidSchema } from "@/utils/checkers/isValidSchema/isValidSchema";
import {
  ErrorCreateSchema,
  codesErrorCreateSchema,
} from "../../Errors/ErrorCreateSchema";
import { isNoAmptyObj } from "@/utils/checkers";
import { SchemaModel, SchemaParam } from "@/types/main";
import { mergeSchema } from "@/utils/mergeSchema/mergeSchema";

/**
 * [Test Cases]
 *  - проверка на валидность reference - схемы
 *  - если есть setting:
 *      - проверка на валидность mods - схемы
 *          - ключи mods[key] матчаться с ключами reference.states
 *      - проверка на наличие init
 *      - если init есть - проверить на валидность
 *  - валидность сгенерированных схем из mods
 * */

export default function createSchema<
  TargetName extends string,
  SignalName extends string,
  ModeNames extends string,
  T extends ModeNames
>(
  param: SchemaParam<TargetName, SignalName, ModeNames, T>
): SchemaModel<TargetName, SignalName, ModeNames> | Error {
  if (!(param instanceof Object)) {
    return new ErrorCreateSchema(
      codesErrorCreateSchema.PARAM_TYPE,
      `Ошибка типа параметра функции param = ${param}`
    );
  }
  if (!isNoAmptyObj(param)) {
    return new ErrorCreateSchema(
      codesErrorCreateSchema.PARAM_AMPTY,
      `Пустые параметры param = ${param}`
    );
  }
  // проверка на валидность reference
  const errorValidSchema = isValidSchema(param.reference);
  if (errorValidSchema instanceof Error) {
    const error = new ErrorCreateSchema(
      codesErrorCreateSchema.INVALID_REFERENCE,
      `${errorValidSchema.message}`
    );
    return error;
  }
  // Если есть настройки - то генерируем схемы в модификаторы иначе undefined
  const mods = param.setting
    ? createMods<TargetName, SignalName, ModeNames>(
        param.reference,
        param.setting.mods
      )
    : undefined;

  // проверка валидности сгенерированных mods
  if (mods && isNoAmptyObj(mods)) {
    for (let keyMod in mods) {
      const schema = mods[keyMod];
      const isValid = isValidSchema(schema);
      if (isValid instanceof Error) {
        const msg = `mod=${keyMod} - schema=${JSON.stringify(
          schema
        )} - concrete error - ${isValid}`;
        return new ErrorCreateSchema(codesErrorCreateSchema.INVALID_MODS, msg);
      }
    }
  }

  // Проверка setting.init
  if (mods && param.setting && !param.setting.init)
    return new ErrorCreateSchema(
      codesErrorCreateSchema.NO_INIT,
      `setting.init - ${JSON.stringify(param.setting.init)}`
    );
  if (mods && isNoAmptyObj(mods) && param.setting && param.setting.init) {
    if (!mods[param.setting.init]) {
      const msg = `setting.init = ${
        param.setting.init
      }, mods keys = ${Object.keys(mods)}`;
      return new ErrorCreateSchema(codesErrorCreateSchema.INVALID_INIT, msg);
    }
  }

  const defaultSchema: Schema<TargetName, SignalName> = mods
    ? mods[param.setting?.init as ModeNames]
    : param.reference;

  const context = createReadonly({
    mods,
    schema: defaultSchema,
  });

  const value = () => context.schema;

  const checkout = (targetMod: ModeNames): Error | true => {
    if (!mods)
      return new ErrorCreateSchema(codesErrorCreateSchema.CHECKOUT_NONE_MODS);
    if (!mods[targetMod])
      return new ErrorCreateSchema(
        codesErrorCreateSchema.CHECKOUT_MISS_MOD,
        targetMod
      );
    context.schema = mods[targetMod];
    return true;
  };

  return {
    value,
    checkout,
  };
}

function createMods<
  TargetName extends string,
  SignalName extends string,
  ModeNames extends string
>(
  reference: Schema<TargetName, SignalName>,
  mapMods: Record<ModeNames, ModeSchema<TargetName, SignalName>>
): Record<ModeNames, Schema<TargetName, SignalName>> {
  const mods = {} as Record<ModeNames, Schema<TargetName, SignalName>>;
  keys<ModeNames>(mapMods).forEach((key: ModeNames) => {
    if (mapMods && mapMods[key]) {
      mods[key] = mergeSchema(reference, mapMods[key]) as Schema<
        TargetName,
        SignalName
      >;
    }
  });
  return mods;
}

function keys<Keys extends string>(obj: Record<Keys, object>): Array<Keys> {
  const result = Object.keys(obj);
  return result as Array<Keys>;
}
