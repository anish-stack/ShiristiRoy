// Tiny duration parser: '15m','7d','3600s','2h'
export default function ms(input) {
  if (typeof input === 'number') return input;
  const m = /^(\d+)\s*(ms|s|m|h|d)$/i.exec(String(input).trim());
  if (!m) return Number(input) || 0;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  const mul = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[u];
  return n * mul;
}
