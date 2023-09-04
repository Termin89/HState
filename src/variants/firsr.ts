const _steps = [
    "AUTH",
    "DATA",
    "INFO",
    "CULC",
    "REJECT",
    "DONE",
    "ERROR",
  ] as const;
  
  const screens = [
    "AUTH_DC",
    "AUTH_CC",
    "DATA_FIO",
    "DATA_PASSPORT",
    "DATA_WORK",
    "INFO_OFFER",
    "INFO_SERVICES",
    "REJECT_OFFER",
    "REJECT_WORK",
    "REJECT_OFFER_DC",
  ] as const;
  
  const INIT = "AUTH";
  const ends = ["DONE", "ERROR", "REJECT"] as const;
  const signals = ["ERROR", "REJECT", "NEXT"] as const;
  
  const state = {
    actyal: "", // Актуальное состояние
    history: [], // Массив состояний - который уже был
    isInit: "", // Было - ли проинициализированно состояние
  };
  // Хук переходов в качестве параметра передается callback
  function transition() {} 
  
  // Реализовать кейс, где возможно и не понятно изначально с какого состояния начать
  // или есть особенность где нужно переинициализировать первое состояние
  function init() {}
  
  // Будем брать данные из стораджа или передавать их каким-то способом - чтобы понять от куда нужно начать.
  // в данном случае инициализация не нужна. Соотвественно продумать логику где нужно инициализироваться
  function resetStates() {}
  
  // Реализовать proxy - основанная на эту схему где реализовать реактивность
  const _schema = {
    initStep: INIT,
    state: state,
    steps: {
      AUTH: {
        NEXT: "DATA",
        ERROR: "ERROR",
      },
      DATA: {
        NEXT: "INFO",
        REJECT: "REJECT",
        ERROR: "ERROR",
      },
      INFO: {
        NEXT: "CULC",
      },
      CULC: {
        NEXT: 'DONE',
        REJECT: "REJECT",
        ERROR: "ERROR",
      },
    },
    ends: ends
  };
  