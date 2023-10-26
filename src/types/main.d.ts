type TypesState = "END" | "CLOSE"; // Типы состояний например Конечная точка в данном случае "END"

// Состояние
type State<TargetName extends string> = {
  value: TargetName;
  type?: TypesState;
  done?: boolean;
  previos?: State<TargetName>;
};

// Тип схемы состояния
type StateSchema<TargetName extends string, SignalName extends string> = {
  signals?: SignalsOptions<TargetName, SignalName>;
  type?: TypesState;
};

// Сигнатура сигналов в схеме
type SignalsOptions<
  TargetName extends string,
  SignalName extends string
> = Partial<Record<SignalName, TargetName>>;

// Сигнатура состояний в схеме
type StatesOptions<
  TargetName extends string,
  SignalName extends string
> = Record<TargetName, StateSchema<TargetName, SignalName>>;

// Тип схемы
type Schema<TargetName extends string, SignalName extends string> = {
  context?: {};
  initState: TargetName;
  signals?: SignalsOptions<TargetName, SignalName>;
  states: StatesOptions<TargetName, SignalName>;
};

type ModeSchema<
  TargetName extends string,
  SignalName extends string
> = Partial<{
  context?: {};
  initState?: TargetName;
  signals?: Partial<SignalsOptions<TargetName, SignalName>>;
  states?: Partial<StatesOptions<TargetName, SignalName>>;
}>;

// Обьект контекста машины
type MachineContext<TargetName extends string, SignalName extends string> = {
  schema: Schema<TargetName, SignalName>;
  name?: string;
  isInit: boolean;
};

type Machine<TargetName extends string, SignalName extends string> =
  | {
      transition: (
        state: State<TargetName>,
        signal: SignalName
      ) => Error | State<TargetName>;
      init: (state?: State<TargetName>) => Error | State<TargetName>;
      context: MachineContext<TargetName, SignalName>;
    }
  | Error;
type ActorContext<TargetName extends string> = {
  isStart: boolean;
  state: State<TargetName> | undefined;
  history: ElemHistory<TargetName>[];
};
type Actor<TargetName extends string, SignalName extends string> =
  | {
      start: (targetName?: TargetName) => Error | undefined;
      send: (SignalName: SignalName) => Error | undefined;
      context: ActorContext<TargetName>;
      pushDetailHistory: (value: object) => void;
    }
  | Error;

type DetailElemHistory = {
  time: Date;
  value: object;
};
type ElemHistory<TargetName extends string> = {
  startTime: Date;
  endTime: Date | undefined;
  value: State<TargetName>;
  detail: Array<DetailElemHistory>;
};

export type {
  TypesState,
  State,
  StateSchema,
  SignalsOptions,
  StatesOptions,
  Schema,
  MachineContext,
  Machine,
  Actor,
  ActorContext,
  ElemHistory,
  DetailElemHistory,
  ModeSchema,
};
