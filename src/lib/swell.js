export function swellSegs(kj) {
  if (kj < 500) return 1;
  if (kj < 1000) return 2;
  if (kj < 2000) return 3;
  if (kj < 3000) return 4;
  return 5;
}
