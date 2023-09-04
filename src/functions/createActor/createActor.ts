import {
  Actor,
  ActorContext,
  DetailElemHistory,
  ElemHistory,
  Machine,
  State,
} from "../../types/main";
import createReadonly from "../../utils/createReadonly/createReadonly";
import createState from "../../utils/createState/createState";
import createElemHistory from "../../utils/createElemHistory/createElemHistory";

export default function createActor<
  TargetName extends string,
  SignalName extends string
>(
  mashine: Machine<TargetName, SignalName>,
  name?: string
): Actor<TargetName, SignalName> {
  const { schema } = mashine.context;

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
    const stateName = targetName ? targetName : schema.initState;
    const stateSchema = schema.states[stateName];

    if (!stateSchema) {
      const error = new Error(
        `createActor: ${name} start() не имеет схемы состояния`
      );
      error.name = "START_NO_STATE_SCHEMA";
      return error;
    }
    const firstState = createState(stateName, stateSchema);
    if (firstState instanceof Error) {
      const error = new Error(
        `createActor: ${name} start() нет первого состояния`
      );
      error.name = "START_NO_STATE";
      return error;
    }
    const init = mashine.init(firstState);
    if (init instanceof Error) {
      const error = new Error(
        `createActor: ${name} ошибка инициализации machine`
      );
      error.name = "START_NO_INIT";
      return error;
    }
    context.isStart = true;
    context.state = init;
    pushHistory(init);
  };

  const send = (signalName: SignalName) => {
    if (!context.isStart) {
      const error = new Error(
        `createActor: ${name} send() актор не запущен чтобы делать`
      );
      error.name = "SEND_NO_START";
      return error;
    }
    if (!context.state) {
      const error = new Error(
        `createActor: ${name} send() нет актуальнго состояния`
      );
      error.name = "SEND_NO_STATE";
      return error;
    }
    const expectedState = mashine.transition(context.state, signalName);

    if (expectedState instanceof Error) {
      const error = new Error(`createActor: ${name} send() ошиба перехода`);
      error.name = "SEND_TRANSITION";
      return error;
    }
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
