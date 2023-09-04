// @ts-nocheck
import { SchemaOneLevel } from "../../types/main";
import createState from "../../utils/createState/createState";
import createMachine from "../createMashine/createMachine";
import createActor from "./createActor";

/**
 * Актор в данном контексте это сущьность которая принимает в себя машину
 * в качестве механизва переходов из состояния в состояние и хранит контекст, историю,
 * 1. Старт актора start(state) - нужно проинициализировать машину
 *      - [ERROR] нет схемы State
 *      - [ERROR] не создаеться State
 *      - [ERROR] ошибка инициализации mashine
 *      - [SUCCESS] удачный старт
 *          - start() => void
 *          - start(targetName) => void
 * 2. send(signal) - посылаем сигнал
 *      - [ERROR] - данный сигнал не обрабатывается
 *      - [SUCCESS]
 *          - удачный переход в следующее состояние
 * 3. Проверка записи истории
 *      - Пройти немного по схеме и посмотреть на то что история записываеться
 *      - Пройти и позаписывать немного деталий истории
 * */
describe("[TEST actor]", () => {
  const states = ["FIRST", "NEXTED", "DONED", "ERRORED"] as const;
  const signals = ["NEXT", "ERROR"] as const;
  type Targets = (typeof states)[number];
  type Signals = (typeof signals)[number];
  const schema: SchemaOneLevel<Targets, Signals> = {
    initState: "FIRST",
    states: {
      FIRST: {
        signals: {
          NEXT: "NEXTED",
        },
      },
      NEXTED: {
        signals: {
          NEXT: "DONED",
        },
      },
      DONED: {
        type: "END",
      },
      ERRORED: {
        type: "END",
      },
      NO_SCHEMA: {},
    },
    signals: {
      ERROR: "ERRORED",
    },
  };
  describe("1. [start()]", () => {
    it("[ERROR] no state schema", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isError = flow.start("FIRSTER");
      expect(isError.name).toBe("START_NO_STATE_SCHEMA");
    });
    it("[ERROR] init", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      flow.start();
      const isError = flow.start();
      expect(isError.name).toBe("START_NO_INIT");
    });
    it("[SUCCESS] start()", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isError = flow.start();
      expect(isError).toBeUndefined();
    });
    it("[SUCCESS] start(targetName)", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isError = flow.start("NEXTED");
      expect(isError).toBeUndefined();
    });
  });

  describe("2. [send()]", () => {
    it("[ERROR] no start", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isError = flow.send("ERROR");
      expect(isError.name).toBe("SEND_NO_START");
    });
    it("[ERROR] transition - no valid signal", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isStartError = flow.start();
      expect(isStartError).toBeUndefined();
      const isSendError = flow.send("ERRORdd");
      expect(isSendError.name).toBe("SEND_TRANSITION");
    });

    it("[SUCCESS] valid send", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isStartError = flow.start();
      const startState = createState("FIRST", {
        signals: {
          NEXT: "NEXTED",
        },
      });
      const expectedState = createState(
        "NEXTED",
        {
          signals: {
            NEXT: "DONED",
          },
        },
        startState
      );
      expect(isStartError).toBeUndefined();
      const isSendError = flow.send("NEXT");
      expect(isSendError).toBeUndefined();
      const newState = flow.context.state;
      expect(newState).toEqual(expectedState);
    });
  });
  describe("3. [Check write history]", () => {
    it("it write in history", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isStartError = flow.start();
      expect(isStartError).toBeUndefined();
      flow.send("NEXT");
      flow.send("NEXT");
      const isStory = !!flow.context.history.length;
      expect(isStory).toBeTruthy();
    });
    it("it write in detail history", () => {
      const mashime = createMachine(schema);
      const flow = createActor<Targets, Signals>(mashime);
      const isStartError = flow.start();
      expect(isStartError).toBeUndefined();
      flow.pushDetailHistory({
        type: "Check",
        msg: "Все отлично пишим код дальше",
      });
      flow.pushDetailHistory({
        type: "Check - 2",
        msg: "Проверка на дабоаление",
      });
      flow.send("NEXT");
      flow.pushDetailHistory({
        type: "Check NEXT",
        msg: "Все отлично пишим код дальше",
      });
      flow.pushDetailHistory({
        type: "Check NEXT - 2",
        msg: "Проверка на дабоаление",
      });
      flow.send("NEXT");
      flow.pushDetailHistory({
        type: "Check DONE",
        msg: "Все отлично пишим код дальше",
      });
      flow.pushDetailHistory({
        type: "Check DONE - 2",
        msg: "Проверка на дабоаление",
      });
      flow.context.history.forEach((story) =>
        story.detail.forEach((detailElem) => console.log(detailElem))
      );
      const isWriteStoryDetails = flow.context.history.every(
        (story) => !!story.detail.length
      );
      expect(isWriteStoryDetails).toBeTruthy();
    });
  });
});
