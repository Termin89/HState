import { isNoAmptyObj } from ".";

export function isValidSignals(
  statesKeys: Array<string>,
  signals: Record<string, string>
) {
  return (
    Object.values(signals).every((signal) => statesKeys.includes(signal)) &&
    isNoAmptyObj(signals as any)
  );
}
