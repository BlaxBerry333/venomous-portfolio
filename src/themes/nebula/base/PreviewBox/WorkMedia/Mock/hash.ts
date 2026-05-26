// 把字符串散列成稳定正整数；同一 seed 永远生成同一 mock 内容
export function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// 基于 seed 字符串 + 通道 i 的稳定伪随机 0~1
// 截到 4 位小数，避免 Math.sin 在 Node / V8 浏览器尾位 ULP 差异导致 hydration mismatch
export function rand(seed: string, i: number): number {
  const h = hashSeed(seed);
  const x = Math.sin(h * 9301 + i * 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 10000) / 10000;
}

export function randInt(seed: string, i: number, min: number, max: number): number {
  return Math.floor(rand(seed, i) * (max - min + 1)) + min;
}

export function randFloat(seed: string, i: number, min: number, max: number): number {
  return Math.round((rand(seed, i) * (max - min) + min) * 10000) / 10000;
}
