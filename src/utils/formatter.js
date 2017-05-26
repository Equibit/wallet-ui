export function toMaxPrecision (val, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(val * factor) / factor;
}
