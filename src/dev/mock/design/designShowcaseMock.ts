import type * as UI from "@/ui/shared/kit";
import type * as Theme from "@/ui/themes";

export interface DesignShowcaseInspiration {
  source: string;
  note: string;
}

export interface DesignShowcaseInteraction {
  gesture: string;
  effect: string;
}

export interface DesignShowcaseGroup {
  tagline: string;
  inspirations: DesignShowcaseInspiration[];
  motive: string;
}

export interface DesignShowcaseVariant {
  summary: string;
  inspirations: DesignShowcaseInspiration[];
  interactions: DesignShowcaseInteraction[];
}

export const DESIGN_SHOWCASE_GROUPS: Record<Theme.GroupId, DesignShowcaseGroup> = {
  warhammer: {
    tagline: "占位：战锤 40K 分组的一句话定位，正式文案之后写。",
    inspirations: [
      {
        source: "Warhammer 40,000 · 亚空间",
        note: "现实之下的灵能之海，由情绪与思想塑形。取它的厚重、翻涌和不可知。",
      },
    ],
    motive: "占位：为什么选这个主题、它和我的关系。正式文案之后写。",
  },
  dmc: {
    tagline: "Stylish。同一个血脉，两种出刀方式。",
    inspirations: [
      {
        source: "Stylish 评价系统",
        note: "动作游戏里给操作打分的那块面板。在这里用来回应读者的点击与划动。",
      },
    ],
    motive: "占位：为什么选这个主题、它和我的关系。正式文案之后写。",
  },
};

export const DESIGN_SHOWCASE_VARIANTS: Record<Theme.VariantId, DesignShowcaseVariant> = {
  tzeentch: {
    summary: "变化本身就是秩序。一片永远在翻涌、却从不重复的以太之海。",
    inspirations: [
      {
        source: "Tzeentch · 万变之主",
        note: "四神中掌管变化与谋略的一位。配色沿用旧版星云的青与蓝，不取紫和粉，不取符号。",
      },
      {
        source: "体积云与积雨云摄影",
        note: "云层朝光源一侧被照亮、背光侧沉入暗部，用来给二维着色器造出厚度。",
      },
    ],
    interactions: [
      { gesture: "不操作时", effect: "云层缓慢翻涌，云团深处不时亮起几处闪光" },
      { gesture: "移动鼠标", effect: "远近几层云随指针错开，产生视差" },
      { gesture: "单击", effect: "落点一闪，炸出一道短分叉的灵能闪电，照亮周围的云" },
      {
        gesture: "连续快速点击",
        effect: "指针处的云开始聚能翻搅，第 5 下光核连续劈出数道闪电",
      },
      {
        gesture: "长按",
        effect:
          "云层绕按住的位置卷成漩涡并被拨开；一道灵能闪电从光核劈到指针，沿途的云从内部被照亮，分叉在云里乱窜",
      },
      { gesture: "按住拖动", effect: "漩涡和闪电一起跟着指针走" },
      { gesture: "滚动页面", effect: "像在云层间前后穿行，云团随之变化" },
    ],
  },
  slaanesh: {
    summary: "占位：色孽的一句话定位，正式文案之后写。",
    inspirations: [
      {
        source: "Slaanesh · 色孽",
        note: "四神中掌管欲望与极致的一位。配色只取紫与粉，不取蓝和金，不取符号。",
      },
      {
        source: "体积云与积雨云摄影",
        note: "云层朝光源一侧被照亮、背光侧沉入暗部，用来给二维着色器造出厚度。",
      },
    ],
    interactions: [
      { gesture: "不操作时", effect: "云层缓慢翻涌，云团深处不时亮起几处闪光" },
      { gesture: "移动鼠标", effect: "远近几层云随指针错开，产生视差" },
      { gesture: "单击", effect: "落点泛起一圈向外扩散的波纹，伴随一瞬闪光" },
      {
        gesture: "连续快速点击",
        effect: "波纹不再叠加，而是被反复注能；指针处的云开始聚能翻搅，第 5 下释放一次亚空间涌动",
      },
      { gesture: "长按", effect: "云层绕按住的位置卷成漩涡并被拨开，透出背后的光；松手后慢慢合拢" },
      {
        gesture: "按住拖动",
        effect: "漩涡跟着指针，指针后面拖出一缕细细的香雾，被流体带着卷曲，慢慢散进星云",
      },
      { gesture: "滚动页面", effect: "像在云层间前后穿行，云团随之变化" },
    ],
  },
  dante: {
    summary: "张扬、连贯，越打越燃。",
    inspirations: [
      {
        source: "Devil May Cry · 但丁",
        note: "红色长风衣与叛逆之剑。张扬、连贯、越打越快，评价从 D 一路升到 SSS。",
      },
    ],
    interactions: [
      {
        gesture: "单击（第 1–4 下）",
        effect: "叛逆之剑四连斩：横斩、反手斩、下劈、上挑；下劈最重，落点震屏",
      },
      { gesture: "连点第 5 下", effect: "百万刺：10 道突刺铺满扇面，最后一记重刺" },
      { gesture: "按住拖动后松手", effect: "朝拖动方向甩出一道带残影的月牙剑气，飞过画面" },
      { gesture: "快速挥动", effect: "沿轨迹留下月牙形剑影" },
      { gesture: "评价升档", effect: "从 B 档起，背景底部燃起红色火光，越往上越旺" },
      { gesture: "进入魔人化（SSS）", effect: "背景闪红并震屏，之后随心跳持续闪动" },
      {
        gesture: "魔人化中出招",
        effect: "刀光变宽并缠上红色闪电；百万刺增至 20 道，最后一记更粗、劈出闪电、背景闪红",
      },
    ],
  },
  vergil: {
    summary: "克制、笔直，越安静越重。",
    inspirations: [
      {
        source: "Devil May Cry · 维吉尔",
        note: "蓝色长风衣与阎魔刀。克制、笔直、出刀后延迟的一瞬才见切痕。",
      },
    ],
    interactions: [
      {
        gesture: "单击（第 1–4 下）",
        effect: "延迟一瞬浮现次元斩，随后碎裂消散；第 3、4 下范围变大",
      },
      { gesture: "连点第 5 下", effect: "End：画面定格成灰白，切线依次划过，整个空间碎裂" },
      { gesture: "按住拖动后松手", effect: "在松手处落一记大范围次元斩" },
      { gesture: "快速甩动", effect: "甩完一次性打出一道笔直刀光" },
      { gesture: "评价升档", effect: "从 B 档起，背景底部燃起蓝色火光，越往上越旺" },
      { gesture: "进入魔人化（SSS）", effect: "背景闪蓝并震屏，之后随心跳持续闪动" },
      {
        gesture: "魔人化中出招",
        effect:
          "次元斩更长更亮，三把幻影剑从不同方向先后钉入落点；甩动刀光带蓝光；End 切线更多、碎得更碎",
      },
    ],
  },
};

export const DESIGN_SHOWCASE_TOKENS = [
  "--theme-panel-bg",
  "--theme-panel-border",
  "--theme-panel-blur",
  "--theme-panel-shadow",
  "--theme-panel-skew",
  "--theme-radius",
  "--theme-font-title",
  "--theme-font-body",
] as const;

export const DESIGN_SHOWCASE_ART_PROJECTS = {
  UIPackage: "Venomous UI",
  DesignSystem: "Venomous UI · Token",
  Platform: "Geniee-X",
  Gateway: "GENIEE CDP",
  Workflow: "GENIEE CHAT · Workflow",
  Migration: "GENIEE CHAT · 迁移架构",
  Ads: "SKYFLAG",
  Booking: "SAGA Sunrise Park",
  Voting: "投票排名",
  Dashboard: "Dashboard",
  Dialogue: "Tenebrae",
  Mobile: "Vant",
  Charts: "数据可视化",
} satisfies Partial<Record<keyof typeof UI.Art, string>>;
