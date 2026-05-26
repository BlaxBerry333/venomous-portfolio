import WorkMedia from "./WorkMedia";

/**
 * PreviewBox —— sanguine 风「项目印象」入口。
 *
 * 与 nebula 的 PreviewBox 同构。当前只暴露 WorkMedia（按 previewCode 渲染
 * 固定 UI 假截图）；想自由拼装直接 import Mock 写自己的 compound 树。
 */
const PreviewBox = {
  WorkMedia,
} as const;

export default PreviewBox;
