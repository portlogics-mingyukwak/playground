export default function isRefObject<T>(
  ref: React.ForwardedRef<T>,
): ref is React.RefObject<T> {
  return ref !== null && typeof ref === "object" && "current" in ref;
}
