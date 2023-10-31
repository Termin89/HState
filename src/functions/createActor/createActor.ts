import {
  Actor,
  ActorContext,
  DetailElemHistory,
  ElemHistory,
  Machine,
  MachineContext,
  State,
} from "@/types/main";
import createReadonly from "@/utils/createReadonly/createReadonly";
import createState from "@/utils/createState/createState";
import createElemHistory from "@/utils/createElemHistory/createElemHistory";
import {
  ErrorCreateActor,
  codesErrorCreateActor,
} from "@/Errors/ErrorCreateActor";
export default function createActor<
  TargetName extends string,
  SignalName extends string,
  ModeNames extends string
>(
  mashine: Machine<TargetName, SignalName, ModeNames>,
  name?: string
): Actor<TargetName, SignalName> {
  if (mashine instanceof Error)
    return new ErrorCreateActor(
      codesErrorCreateActor.MASHINE,
      `${mashine.message}`
    );

  const { schema } = mashine;
  const context: ActorContext<TargetName> = {
    isStart: false,
    state: undefined,
    history: [],
  };

  const contextReadonly = createReadonly(context);
  // - private
  const getLastElemHistory = (): ElemHistory<TargetName> => {
    const lastHistory = context.history[context.history.length - 1];
    return lastHistory;
  };

  const pushHistory = (state: State<TargetName>) => {
    const elemHistory = createElemHistory(state);
    context.history.push(elemHistory);
  };

  const pushEndTimeState = (time: Date) => {
    const lastElemHistory = getLastElemHistory();
    lastElemHistory.endTime = time;
  };

  // ---

  const start = (targetName?: TargetName) => {
    const schemaReference = schema.value();
    const stateName = targetName ? targetName : schemaReference.initState;
    const stateSchema = schemaReference.states[stateName];

    if (!stateSchema)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_STATE_SCHEMA,
        `createActor: ${name} start() не имеет схемы состояния`
      );

    const firstState = createState(stateName, stateSchema);
    if (firstState instanceof Error)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_STATE_SCHEMA,
        `createActor: ${name} start() нет первого состояния`
      );

    const init = mashine.init(firstState);
    if (init instanceof Error)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_STATE_SCHEMA,
        init.message
      );

    context.isStart = true;
    context.state = init;
    pushHistory(init);
  };

  const send = (signalName: SignalName) => {
    if (!context.isStart)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_START,
        `createActor: ${name} send() актор не запущен чтобы делать`
      );

    if (!context.state)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_ACTYAL_STATE,
        `createActor: ${name} send() нет актуальнго состояния`
      );

    const expectedState = mashine.transition(context.state, signalName);

    if (expectedState instanceof Error)
      return new ErrorCreateActor(
        codesErrorCreateActor.NO_ACTYAL_STATE,
        expectedState.message
      );

    pushEndTimeState(new Date());
    pushHistory(expectedState);
    if (expectedState.done) {
      pushEndTimeState(new Date());
    }
    context.state = expectedState;
  };

  const pushDetailHistory = (value: object) => {
    const lastHistory = getLastElemHistory();
    const detailElemHistory: DetailElemHistory = {
      time: new Date(),
      value,
    };
    if (lastHistory) {
      lastHistory.detail.push(detailElemHistory);
    }
  };

  return { start, context: contextReadonly, send, pushDetailHistory };
}
