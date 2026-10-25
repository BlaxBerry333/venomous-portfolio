import type * as I18n from "@/i18n";

export const WORKS = {
  "geniee-x": {
    subtitle: "AI 一站式网站分析・搭建・预约转化平台",
    period: "2026 – 至今",
    role: "UI/UX Design Team 负责人\n全栈开发担当（兼务）",
    summary:
      "面向预约、到店型企业的 AI 平台，把网站分析、网站搭建和预约转化管理放在一处。AI 负责分析、搭建和日常运营，并整合了顾客 CRM、LINE 联动、AI 聊天、MA、CDP 等功能。",
    contributionSummary:
      "负责 UI/UX Design Team，主导 GENIEE-X 的 UX 与设计基础建设；同时兼任制作与表单功能的全栈开发。",
    contributions: [
      {
        title: "UX 与设计基础",
        text: "带领 UI/UX Design Team 定下 UX 方针，搭建设计基础，并正在设计 Design System，让各功能团队用同一套设计语言开发。",
      },
      {
        title: "制作与表单功能",
        text: "兼任功能开发团队，负责网站制作与表单相关功能的全栈开发。",
      },
    ],
  },
  "geniee-cdp": {
    subtitle: "顾客数据平台 SaaS",
    period: "2025 – 2026",
    role: "前端 Tech Lead",
    summary:
      "面向企业的顾客数据平台 SaaS。把网站、APP、CRM、广告等分散的顾客数据归并成同一个人、统一字段，再交给公司的营销、分析等产品，以及客户自己的分析使用。",
    contributionSummary:
      "为在短期内上线，主导采用 Next.js 全栈与 tRPC 的架构；在此之上开发 SQL 编辑器与 AI 元数据生成，后者成为公司其他产品调用 CDP 的数据基础。数据隔离与查询量的控制由数据处理团队负责。",
    contributions: [
      {
        title: "AI 元数据",
        text: "结合 AI 分析 BigQuery 里的数据，生成并更新元数据。公司其他产品调用 CDP 做数据分析时，以这份元数据为基础。",
      },
      {
        title: "集成 BigQuery 的 SQL 编辑器",
        text: "让不写代码的成员也能直接调取和配置数据。和元数据一样，提案、设计、实现都由我完成。",
      },
      {
        title: "Next.js 全栈架构",
        text: "Casbin 权限判定和 BigQuery、GCS、S3、Azure Blob 等数据源的 SDK 都在服务端执行，客户端只拿权限裁剪后的数据，凭据只在服务端。tRPC 让 API 的改动在编译期就暴露出来。",
      },
      {
        title: "埋点规范",
        text: "统一 GTM 和 GA4 的埋点规范，字段命名、参数结构、触发时机三方面对齐，前端埋的点分析侧都能读出来。",
      },
      {
        title: "OKR 评价连续 A+",
        text: "在公司 OKR 评价中连续 2 个季度获得最高评价 A+。",
      },
    ],
  },
  "geniee-chat": {
    subtitle: "Chatbot 型 Web 接客 SaaS",
    period: "2023 – 至今",
    role: "全栈开发担当",
    summary:
      "面向企业的 Chatbot 型 Web 接客 SaaS，用对话式接客和表单优化（EFO）提升网站转化。产品由运营方使用的管理后台，和嵌入客户网站的聊天弹窗两部分组成。",
    contributionSummary:
      "负责管理后台的全栈开发。前端迁移时主导选型，按 ToB 管理画面的特点采用 SPA（React + Vite）；之后围绕可视化 Workflow，完成编辑器、节点定义的统一管理，以及 AI 检查与分析。",
    contributions: [
      {
        title: "管理后台重写与开发链路",
        text: "前端迁移的技术选型由我主导，搭 React + TypeScript + Vite 的新基座，toolchain 的配置与规范全部由我完成。只重做画面、不动后端 API，分六步替换旧画面，新基座完成后冻结旧画面开发，避免两套并行维护。开发链路方面，从 CI/CD 变慢查起：用可视化工具找出并精简异常大的依赖，检查改成本地并行执行、只查改动文件、开缓存；还实现了按目录自动生成路由，并用 ESLint 限定模块出入口，防止循环依赖。",
      },
      {
        title: "Workflow 编辑器",
        text: "用 React Flow 做节点式编辑器。客户的运营人员通过点选连线和模板组合，自己配置应答逻辑，附带对话版本管理。",
      },
      {
        title: "Workflow 节点的统一管理",
        text: "每种节点的组件、样式、表单校验、给 AI 的节点信息，都收在一处定义，几处不会再对不上。",
      },
      {
        title: "分析 Workflow 的 AI agent",
        text: "检查和分析两个 agent 都由我设计并实现。检查 agent 读取节点和连线，用和画面编辑相同的校验规则做检查；分析 agent 在剔除敏感信息之后做分析和回答。CS 不用再逐个节点人工检查，加上编辑器的模板组合，配置并检查一个 Workflow 的时间从 1 小时以上缩短到数分钟。目前在公司内部使用。",
      },
      {
        title: "OKR 评价连续 A+",
        text: "在公司 OKR 评价中连续 4 个季度获得最高评价 A+。",
      },
    ],
  },
  "skyfall-skyflag": {
    subtitle: "成果报酬型广告运营支援 SaaS",
    period: "2023",
    role: "前端开发担当\n前端负责人",
    summary:
      "株式会社 Skyfall 的成果报酬型广告 SaaS。以激励型广告为核心，为游戏、工具、内容类移动 App 提供变现、推广和用户调研三类服务。",
    contributionSummary:
      "实际担任前端技术负责人。带团队改善由 CRA 搭建的旧版管理后台，并主动引入 Vite 与 Refine 逐步替换，让经验不同的成员也能按同一套规则稳定开发。",
    contributions: [
      {
        title: "从 CRA 换到 Vite + Refine",
        text: "旧版管理后台基于官方已不再推荐的 CRA，各画面的路由、表单和数据获取写法也各不相同。先在旧版上改善稳住，再引入 Vite 和 Refine，按画面逐步替换。Refine 把路由、表单和数据获取收进统一基座，成员不用再各自拼装。",
      },
      {
        title: "组件设计规范",
        text: "划清业务组件与通用组件的边界，定下 props 命名和状态归属的规则。通用组件整理进 Storybook，开发规范写进 Docusaurus。",
      },
      {
        title: "对接业务部门",
        text: "作为前端窗口直接对接业务部门，梳理需求，并拆解成团队能推进的任务。",
      },
      {
        title: "新人 Motto 赏",
        text: "入职仅一个月，因推进新管理后台的基座建设获得公司的新人 Motto 赏，是该奖史上最快的记录。Motto 是 Skyfall 的核心价值观。",
      },
    ],
  },
  "fni-saga-sunrise-park": {
    subtitle: "公共设施预约与运营管理系统",
    period: "2019 – 2023",
    role: "全栈开发担当\n前端负责人（后期）",
    summary:
      "佐贺县大型公共设施 SAGAサンライズパーク 的预约与运营系统。由面向市民的来园与设施预约，以及供自治体多个部门使用的运营管理后台两部分组成。",
    contributionSummary:
      "周期三年多、团队几经更替的受托项目。后期担任前端负责人，主导市民预约端与运营管理后台两套前端的大规模改善与重构，并把只在个人手里的知识整理成团队共享的文档。",
    contributions: [
      {
        title: "两套前端的大规模重构",
        text: "对面向市民的预约端（ToC）和内部的运营管理后台（ToB）两套前端做了大规模改善与重构。重构时重新选型 UI 组件库，采用 Ant Design。",
      },
      {
        title: "Sass 样式的整理",
        text: "原来的 Sass 散落各处、层层覆盖，改一处常牵动别处。重构时能用 Ant Design 组件和主题设置解决的部分交给它，剩下的自定义样式按模块收拢，删掉重复和互相覆盖的规则。",
      },
      {
        title: "技术资产文档化",
        text: "人员几经更替，很多知识只在个人手里。用 Docusaurus 整理设计资料、API 规范和前端开发指南，新成员不用逐个问人也能上手。",
      },
    ],
  },
  "venomous-portfolio": {
    subtitle: "多主题实时 3D 作品集网站",
    period: "2026 – 至今",
    role: "个人开发",
    summary:
      "我的作品集网站，也就是你正在看的这个网站。分战锤 40K（奸奇、色孽）和鬼泣（但丁、维吉尔）两组主题，每套都有自己的全屏实时场景、配色和组件外观，支持中日英三语。",
    contributionSummary:
      "设计和实现都由我一个人完成。重点是让每套主题都有完整的沉浸感，同时不拖慢页面。",
    images: {
      tzeentch: "奸奇主题：灵能闪电",
      slaanesh: "色孽主题：亚空间的迷雾",
      dante: "但丁主题：百万突刺与连击评价",
      vergil: "维吉尔主题：次元斩的收尾",
    },
    contributions: [
      {
        title: "每套主题都有自己的演出",
        text: "两组四套主题，每套都是一个全屏实时着色器场景。轻点屏幕会触发对应的演出：奸奇降下灵能闪电，色孽让亚空间的迷雾泛起涟漪，但丁打出百万突刺，维吉尔放出次元斩。",
      },
      {
        title: "连击评价",
        text: "鬼泣主题加了连击评价：连点和移动鼠标会累积分数，停手后逐渐回落，评价从 D 一路升到 SSS；连续命中 5 次会打出收尾招式。",
      },
      {
        title: "按需加载，跑不动就降画质",
        text: "场景代码按主题拆开，只加载当前选中的那一份。运行时监测帧耗时，跟不上就自动降一档画质（共 3 档，调整渲染分辨率），有余力时再升回去；结果记在浏览器里，下次直接从这一档开始。",
      },
      {
        title: "主题与组件分离",
        text: "页面和组件只从每套主题的色彩变量取色，换主题不用改组件。文案按三语分开管理，漏译或多出的条目在类型检查时就会报错。",
      },
    ],
  },
} satisfies I18n.WorkTexts;
