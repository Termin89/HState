import type {
  SchemaOneLevel,
  State,
  MachineContext,
  Machine,
} from "../../types/main";
import createReadonly from "../../utils/createReadonly/createReadonly";
import createState from "../../utils/createState/createState";
import getNewState from "../../utils/getNewState/getNewState";

export default function createOneLevelMachine<
  TargetName extends string,
  SignalName extends string
>(
  schemaObj: SchemaOneLevel<TargetName, SignalName>,
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

  const init = (state?: State<TargetName>) => {
    if (context.isInit) {
      const error = new Error(
        `Данная State Machine с именем: "${context.name}" уже проинициализированна`
      );
      error.name = "INITED";
      return error;
    }
    if (state && !schema.states[state.value]) {
      const error = new Error(
        `В State Machine с именем: "${context.name}" нет схемы для состояния: "${state.value}"`
      );
      error.name = "INIT_SCHEMA";
      return error;
    }
    const initState = state
      ? state
      : createState<TargetName, SignalName>(
          schema.initState,
          schema.states[schema.initState]
        );

    if (!initState) {
      const error = new Error(
        `В State Machine с именем: "${context.name}" не создалось состояние - проверте валидность имен в схеме: `
      );

      error.name = "INIT_NO_STATE";
      return error;
    }

    context.isInit = true;
    return initState;
  };

  const transition = (state: State<TargetName>, signalName: SignalName) => {
    if (!context.isInit) {
      const error = new Error(
        `Данная State Machine с именем: "${context.name}" не проинициализированна - переход невозможен`
      );
      error.name = "NO_INIT";
      return error;
    }

    if (!!state?.done) {
      const error = new Error(
        `Данная State Machine с именем: "${context.name}" находиться в конечном состоянии: ${state?.value} - переход невозможен`
      );
      error.name = "IS_DONE";
      return error;
    }

    const newState = getNewState<TargetName, SignalName>(
      schema,
      state,
      signalName
    );
    return newState;
  };

  return { init, context: contextReadonly, transition };
}
