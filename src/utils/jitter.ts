export function calcDelay(baseDelay: number, jitterEnabled: boolean): number {
  if (!jitterEnabled) return baseDelay;
  const jitter = (Math.random() - 0.5) * 0.4 * baseDelay;
  return Math.max(baseDelay + jitter, 1);
}
