import ZenlessDetailA from "@/themes/zenless/details/ZenlessDetailA";
import type { Locale, Theme } from "@/types";
import HorizontalPanels from "./HorizontalPanels";

/**
 * zenless 主题走重设计的 Mission Console（A）；其他主题保留原 HorizontalPanels。
 */
export default function DetailRouter({
  theme,
  workId,
  locale,
}: {
  theme: Theme;
  workId?: string;
  locale: Locale;
}) {
  return theme === "zenless" ? (
    <ZenlessDetailA workId={workId} locale={locale} />
  ) : (
    <HorizontalPanels theme={theme} workId={workId} locale={locale} />
  );
}
