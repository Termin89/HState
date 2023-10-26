export function isNoAmptyObj(obj: Record<string, unknown>) {
  return !!Object.keys(obj).length;
}
