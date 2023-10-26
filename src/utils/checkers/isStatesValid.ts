import { isValidSignals } from '.';

export function isStatesValid(
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
