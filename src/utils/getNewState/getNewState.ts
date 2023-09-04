import type { State, Schema, Signal } from "../../types/main";
import createState from "../createState/createState";

export default function getNewState<
  TargetName extends string,
  SignalName extends string
>(
  schema: SchemaOneLevel<TargetName, SignalName>,
  state: State<TargetName>,
  signalName: SignalName
) {
  const stateSchema = schema.states[state.value];
  let newStateName: TargetName;

  if (!state.value || !schema.states[state.value]) {
    const error = new Error(
      `Передаваемое состояние ${state} не описано в схеме`
    );
    error.name = "ERROR_STATE";
    return error;
  }

  const signal: TargetName | Signal<TargetName> | undefined =
    (stateSchema.signals && stateSchema.signals[signalName]) || // Смотрим локальный сигнал
    (schema.signals && schema.signals[signalName]); // Если нет локального смотрим глобальный сигнал

  if (!signal) {
    const error = new Error(
      `Данный сигнал: "${signalName}", для состояния ${state.value} в схеме не описан`
    );
    error.name = "ERROR_SIGNAL";
    return error;
  }

  if (typeof signal === "string") {
    newStateName = signal as TargetName;
  } else {
    newStateName = signal.target;
  }

  const newStateSchema = schema.states[newStateName];

  if (!newStateSchema) {
    const error = new Error(
      `Данное состояние: "${newStateName}", в схеме не описано`
    );
    error.name = "ERROR_NEW_STATE";
    return error;
  }

  const newState = createState<TargetName, SignalName>(
    newStateName,
    newStateSchema,
    state
  );

  return newState;
}
