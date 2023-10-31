type ErrorParam<Codes extends number> = {
  code: Codes;
  map: Record<Codes, string>;
  name: string;
  msg?: string;
};

export class ErrorApp<Codes extends number> extends Error {
  readonly code: Codes;
  mapCode: Record<Codes, string>;
  constructor(param: ErrorParam<Codes>) {
    super();
    this.name = param.name;
    this.code = param.code;
    this.mapCode = param.map;
    this.message = createErrorMessage(
      this.name,
      this.code,
      this.mapCode[this.code],
      param.msg
    );
  }
  chekoutMap(map: Record<Codes, string>) {
    this.mapCode = map;
  }
}

export function createErrorMessage(
  name: string,
  code: number,
  messageCode: string,
  detailsMessage?: string
) {
  return `[${name}] - code:[${code}] - message: ${messageCode} - detail: (${
    detailsMessage ? detailsMessage : "-//-"
  })`;
}
