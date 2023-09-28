import { ElemHistory, State } from "@/types/main";

export default function createElemHistory<TargetName extends string>(
  state: State<TargetName>
): ElemHistory<TargetName> {
  return {
    startTime: new Date(),
    endTime: undefined,
    value: state,
    detail: [],
  };
}
