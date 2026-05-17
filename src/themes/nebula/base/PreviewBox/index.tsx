import Image from "./Image";
import ScaleFrame from "./ScaleFrame";
import WorkMedia from "./WorkMedia";

const PreviewBox = {
  WorkMedia,
  Image,
  ScaleFrame,
} as const;

export default PreviewBox;
