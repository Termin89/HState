export function isValidInitState(initState: string, states: Array<string>) {
  return states.includes(initState);
}
