import type { Locale } from "@/utils/i18n";

export type AccentMode = "start" | "end";

/** 找 ja 标题里"汉字 → 片假名"切换点（例如"代表プロジェクト"的位置 2）；找不到返回 -1。 */
function findIdeographToKatakana(s: string): number {
  let lastIdeo = false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const isIdeo = c >= 0x4e00 && c <= 0x9fff;
    const isKata = (c >= 0x30a0 && c <= 0x30ff) || (c >= 0x31f0 && c <= 0x31ff);
    if (lastIdeo && isKata) return i;
    lastIdeo = isIdeo;
  }
  return -1;
}

/** 找 ja 标题里"平假名 → 汉字"切换点（例如"すべての作品集"的位置 4）；找不到返回 -1。 */
function findHiraganaToIdeograph(s: string): number {
  let lastHira = false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const isHira = c >= 0x3040 && c <= 0x309f;
    const isIdeo = c >= 0x4e00 && c <= 0x9fff;
    if (lastHira && isIdeo) return i;
    lastHira = isHira;
  }
  return -1;
}

/** 在 Heading 接受的 `{...}` 标记里给当前 locale 的标题切割 accent 段。
 *  - en/西文：按空格切，start = 首词红，end = 末词红
 *  - ja：先看汉字↔片假名切换点（"代表プロジェクト" → start:代表 / end:プロジェクト）；
 *        否则按字数中点（"職務経歴" → start:職務 / end:経歴）
 *  - zh / 其它 CJK：按字数中点
 *  - 单/双字直接整段 accent
 */
export function accentTitle(title: string, locale: Locale, mode: AccentMode = "end"): string {
  if (title.includes(" ")) {
    if (mode === "start") {
      const i = title.indexOf(" ");
      return `{${title.slice(0, i)}}${title.slice(i)}`;
    }
    const i = title.lastIndexOf(" ");
    return `${title.slice(0, i + 1)}{${title.slice(i + 1)}}`;
  }

  if (locale === "ja") {
    // 优先：汉字→片假名（"代表プロジェクト" → "代表" + "プロジェクト"）
    const kataIdx = findIdeographToKatakana(title);
    if (kataIdx > 0) {
      return mode === "start"
        ? `{${title.slice(0, kataIdx)}}${title.slice(kataIdx)}`
        : `${title.slice(0, kataIdx)}{${title.slice(kataIdx)}}`;
    }
    // 次选：平假名→汉字（"すべての作品集" → "すべての" + "作品集"，避免助词"の"被红色包进去）
    const ideoIdx = findHiraganaToIdeograph(title);
    if (ideoIdx > 0) {
      return mode === "start"
        ? `{${title.slice(0, ideoIdx)}}${title.slice(ideoIdx)}`
        : `${title.slice(0, ideoIdx)}{${title.slice(ideoIdx)}}`;
    }
  }

  const n = title.length;
  if (n <= 2) return `{${title}}`;
  const half = Math.max(1, Math.floor(n / 2));
  if (mode === "start") return `{${title.slice(0, half)}}${title.slice(half)}`;
  return `${title.slice(0, half)}{${title.slice(half)}}`;
}

/** ja 强制首字红（用于代词类标题如 "私について"）；其它 locale 落回 accentTitle(end)。 */
export function jaLeadingAccent(title: string, locale: Locale): string {
  if (locale === "ja") return `{${title.slice(0, 1)}}${title.slice(1)}`;
  return accentTitle(title, locale, "end");
}

/** sanguine 各页 / 组件共用的进场缓动。 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * 进入视口时上浮淡入的 motion props —— 透传给 Text / motion 元素。
 * @param index 同组内序号，用于错开 delay 形成 stagger。
 */
export function riseIn(index = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15%" },
    transition: { duration: 0.6, delay: 0.15 + index * 0.1, ease: EASE },
  } as const;
}
