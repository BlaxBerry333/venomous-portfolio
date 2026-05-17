// Zenless 风公共组件命名空间 — 统一通过 ZenlessUI.X 调用
// 使用：import { ZenlessUI } from "@/themes/zenless/components"
//   <ZenlessUI.Title1 eyebrow="..." title="..." />
//   <ZenlessUI.Button variant="contained">...</ZenlessUI.Button>
import Background from "./Background";
import Bars from "./Bars";
import Button from "./Button";
import Card from "./Card";
import Hazard from "./Hazard";
import PreviewCard from "./PreviewCard";
import Tag from "./Tag";
import Title1 from "./Title1";
import Title2 from "./Title2";
import Title3 from "./Title3";

export const ZenlessUI = {
  Button,
  Title1,
  Title2,
  Title3,
  PreviewCard,
  Card,
  Tag,
  Hazard,
  Bars,
  Background,
};

export type { ZenlessBackgroundProps } from "./Background";
export type { ZenlessBarsColor, ZenlessBarsProps } from "./Bars";
export type { ZenlessButtonAnimation, ZenlessButtonProps, ZenlessButtonVariant } from "./Button";
export type { ZenlessCardColor, ZenlessCardMetric, ZenlessCardProps } from "./Card";
export type { ZenlessHazardColor, ZenlessHazardLabelPosition, ZenlessHazardProps } from "./Hazard";
export type {
  ZenlessPreviewCardColor,
  ZenlessPreviewCardProps,
  ZenlessPreviewCardStatus,
} from "./PreviewCard";
export type { ZenlessTagColor, ZenlessTagProps, ZenlessTagSize, ZenlessTagVariant } from "./Tag";
export type { Title1Props } from "./Title1";
export type { Title2Props } from "./Title2";
export type { Title3Props } from "./Title3";
