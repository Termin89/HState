import type { Schema, State, MachineContext, Machine } from "@/types/main";
import createReadonly from "@/utils/createReadonly/createReadonly";
import createState from "@/utils/createState/createState";
import getNewState from "@/utils/getNewState/getNewState";
import { isValidSchema } from "@/utils/checkers/isValidSchema/isValidSchema";
import {
  ErrorCreateMashine,
  codesErrorCreateMashine,
} from "@/Errors/ErrorCreateMashine";

export default function createMachine<
  TargetName extends string,
  SignalName extends string
>(
  schemaObj: Schema<TargetName, SignalName>,
  __context?: Partial<MachineContext<TargetName, SignalName>>
): Machine<TargetName, SignalName> {
  const context = Object.assign(
    {
      schema: createReadonly(schemaObj),
      isInit: false,
    } as MachineContext<TargetName, SignalName>,
    __context
  );

  const contextReadonly = createReadonly(context);
  const { schema } = context;

  const ifErrorCreateSchema = isValidSchema(schema);
  if (ifErrorCreateSchema instanceof Error) {
    return ifErrorCreateSchema;
  }

  const init = (state?: State<TargetName>) => {
    if (context.isInit)
      return new ErrorCreateMashine(
        codesErrorCreateMashine.ALREDY_INIT,
        `Данная State Machine с именем: "${context.name}" уже проинициализированна`
      );

    if (state && !schema.states[state.value])
      return new ErrorCreateMashine(
        codesErrorCreateMashine.STATE_SCHEMA,
        `В State Machine с именем: "${context.name}" нет схемы для состояния: "${state.value}"`
      );
    const initState = state
      ? state
      : createState<TargetName, SignalName>(
          schema.initState,
          schema.states[schema.initState]
        );

    if (!initState)
      return new ErrorCreateMashine(
        codesErrorCreateMashine.NO_INIT,
        `В State Machine с именем: "${context.name}" не создалось состояние - проверте валидность имен в схеме: `
      );

    context.isInit = true;
    return initState;
  };

  const transition = (state: State<TargetName>, signalName: SignalName) => {
    if (!context.isInit)
      return new ErrorCreateMashine(
        codesErrorCreateMashine.NO_INIT,
        `Данная State Machine с именем: "${context.name}" не проинициализированна - переход невозможен`
      );

    if (!!state?.done)
      return new ErrorCreateMashine(
        codesErrorCreateMashine.STATE_DONE,
        `Данная State Machine с именем: "${context.name}" находиться в конечном состоянии: ${state?.value} - переход невозможен`
      );

    const newState = getNewState<TargetName, SignalName>(
      schema,
      state,
      signalName
    );
    return newState;
  };

  return { init, context: contextReadonly, transition };
}
