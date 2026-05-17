// Void 风公共组件命名空间 — 统一通过 VoidUI.X 调用
// 使用：import { VoidUI } from "@/themes/void/components"
//   <VoidUI.Title1 text="..." accent=".Works" />
//   <VoidUI.Title2 eyebrow="§ 02 — CONTEXT" text="Context" />
//   <VoidUI.Title3 text="Loadout" />
//   <VoidUI.Button variant="contained">...</VoidUI.Button>
//   <VoidUI.Tag variant="primary">...</VoidUI.Tag>
import "../styles/void.css";
import Button from "./Button";
import Card from "./Card";
import Tag, { VOID_TAG_STYLE } from "./Tag";
import Title1 from "./Title1";
import Title2 from "./Title2";
import Title3 from "./Title3";

export const VoidUI = {
  Button,
  Card,
  Tag,
  Title1,
  Title2,
  Title3,
};

export type { VoidButtonProps, VoidButtonVariant } from "./Button";
export type { VoidCardColor, VoidCardProps, VoidCardRow, VoidCardVariant } from "./Card";
export type { VoidTagProps, VoidTagVariant } from "./Tag";
export type { Title1Props } from "./Title1";
export type { Title2Props } from "./Title2";
export type { Title3Props } from "./Title3";
export { VOID_TAG_STYLE };
