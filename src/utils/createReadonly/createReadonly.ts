export default function createReadonly<T extends object>(
  obj: T,
  handler?: ProxyHandler<T>
) {
  return new Proxy(obj, {
    ...handler,
    set() {
      return true;
    },
  });
}
