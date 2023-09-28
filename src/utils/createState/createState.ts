import type { StateSchema, State } from "@/types/main";
export default function createState<
  TargetName extends string,
  SignalName extends string
>(
  name: TargetName,
  stateSchema: StateSchema<TargetName, SignalName>,
  previos?: State<TargetName>
): State<TargetName> {
  return {
    value: name,
    type: stateSchema.type,
    previos: previos,
    done: stateSchema.type === "END" ? true : false,
  };
}
