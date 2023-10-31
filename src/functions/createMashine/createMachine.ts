import type {
  Schema,
  State,
  MachineContext,
  Machine,
  SchemaModel,
} from "@/types/main";
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
  SignalName extends string,
  ModeNames extends string
>(
  schemaObj: SchemaModel<TargetName, SignalName, ModeNames>,
  __context?: Partial<MachineContext<TargetName, SignalName, ModeNames>>
): Machine<TargetName, SignalName, ModeNames> {
  const context = Object.assign(
    {
      schema: schemaObj,
      isInit: false,
    } as MachineContext<TargetName, SignalName, ModeNames>,
    __context
  );

  const contextReadonly = createReadonly(context);
  const { schema } = context;

  if (schema instanceof Error) {
    return schema;
  }

  const init = (state?: State<TargetName>) => {
    const schemaReference = schema.value();
    if (context.isInit)
      return new ErrorCreateMashine(
        codesErrorCreateMashine.ALREDY_INIT,
        `Данная State Machine с именем: "${context.name}" уже проинициализированна`
      );

    if (state && !schemaReference.states[state.value])
      return new ErrorCreateMashine(
        codesErrorCreateMashine.STATE_SCHEMA,
        `В State Machine с именем: "${context.name}" нет схемы для состояния: "${state.value}"`
      );
    const initState = state
      ? state
      : createState<TargetName, SignalName>(
          schemaReference.initState,
          schemaReference.states[schemaReference.initState]
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
    const schemaReference = schema.value();
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
      schemaReference,
      state,
      signalName
    );
    return newState;
  };

  return { init, context: contextReadonly, transition, schema };
}
