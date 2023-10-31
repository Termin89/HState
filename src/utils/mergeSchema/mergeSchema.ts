import { Schema, ModeSchema } from "@/index";

export function mergeSchema<
  TargetName extends string,
  SignalName extends string
>(
  reference: Schema<TargetName, SignalName>,
  ...sources: ModeSchema<TargetName, SignalName>[]
) {
  const result: Schema<TargetName, SignalName> = Object.assign({}, reference);
  for (let source of sources) {
    for (let key in source) {
      const modProperty =
        source[key as keyof ModeSchema<TargetName, SignalName>];
      const refProperty = result[key as keyof Schema<TargetName, SignalName>];
      if (key === "states" && source[key]) {
        const states = source[key];
        for (let state in states) {
          result.states[state] = states[state];
        }
      } else if (
        modProperty instanceof Object &&
        (refProperty instanceof Object || refProperty === undefined)
      ) {
        result[key] = mergeSchema(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
