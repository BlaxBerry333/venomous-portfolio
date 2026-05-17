// 漫画风公共组件命名空间 — 统一通过 MangaUI.X 调用
// 使用：import { MangaUI } from "@/themes/manga/components"
//   <MangaUI.Title1 eyebrow="...">...</MangaUI.Title1>
//   <MangaUI.Button color="red">...</MangaUI.Button>
import "../styles/manga.css";
import Button from "./Button";
import Card from "./Card";
import Panel from "./Panel";
import Quote from "./Quote";
import Tag from "./Tag";
import Timeline from "./Timeline";
import Title1 from "./Title1";
import Title2 from "./Title2";
import Title3 from "./Title3";

export const MangaUI = {
  Title1,
  Title2,
  Title3,
  Button,
  Tag,
  Panel,
  Card,
  Quote,
  Timeline,
};

// 类型与 motion preset 仍按命名导出
export type { MangaButtonColor, MangaButtonProps, MangaButtonSize } from "./Button";
export { BAGUA } from "./Card";
export type { BaguaName, MangaCardBadge, MangaCardColor, MangaCardProps } from "./Card";
export { mangaHoverWobble } from "./motionPresets";
export type { MangaPanelProps } from "./Panel";
export type { QuoteColor, QuoteProps } from "./Quote";
export type { MangaTagColor, MangaTagProps, MangaTagSize } from "./Tag";
export type { MangaTimelineItem, MangaTimelineProps } from "./Timeline";
export type { Title1Props } from "./Title1";
export type { Title2Props } from "./Title2";
export type { Title3Props } from "./Title3";
