import { type WorkPreviewCode } from "@/utils/i18n";
import Mock from "./Mock";
import "./index.scss";

/**
 * PreviewBox.WorkMedia —— work 卡片用的「假截图」预览。
 *
 * 只接 `previewCode`；不传则不渲染。每个 previewCode 的画面 100% 固定
 * （内部 seed 写死成 previewCode 名），消费侧无法 / 无需调整任何细节。
 *
 * 想自由拼装别用这个，直接 import Mock 写自己的 compound 树。
 */

interface Props {
  previewCode?: WorkPreviewCode;
}

// 共用常量：带 sidebar 的 previewCode 都用一样的宽度 + 高亮项
const SIDEBAR_WIDTH = "22%";
const SIDEBAR_ACTIVE = 1;

export default function WorkMedia({ previewCode }: Props) {
  if (!previewCode) return null;
  return (
    <div className="portfolio--nebula-preview-work-media">
      <Mock aspect="16 / 10">
        {previewCode === "analytics" && <AnalyticsScene />}
        {previewCode === "editor" && <EditorScene />}
        {previewCode === "terminal" && <TerminalScene />}
        {previewCode === "workflow" && <WorkflowScene />}
        {previewCode === "blocks" && <BlocksScene />}
        {previewCode === "widgets" && <WidgetsScene />}
        {previewCode === "chat" && <ChatScene />}
        {previewCode === "diff" && <DiffScene />}
        {previewCode === "gallery" && <GalleryScene />}
        {previewCode === "campus" && <CampusScene />}
      </Mock>
    </div>
  );
}

// ============================================================
// 预设场景；每个 previewCode 内部 seed 写死，渲染完全固定
// ============================================================

function AnalyticsScene() {
  return (
    <Mock.Window>
      <Mock.Sidebar
        seed="dashboard/sidebar"
        items={6}
        width={SIDEBAR_WIDTH}
        activeIndex={SIDEBAR_ACTIVE}
      />
      <Mock.Body padding="10px" gap="8px">
        <Mock.KpiRow seed="dashboard/kpi" count={3} />
        <Mock.LineChart seed="dashboard/line" points={10} />
        <Mock.AreaChart seed="dashboard/area" points={9} />
      </Mock.Body>
    </Mock.Window>
  );
}

function EditorScene() {
  return (
    <Mock.Window dots>
      <Mock.Sidebar
        seed="editor/schema"
        items={6}
        width={SIDEBAR_WIDTH}
        activeIndex={SIDEBAR_ACTIVE}
      />
      <Mock.Body padding="0" gap="0">
        <Mock.Tabs seed="editor/tabs" items={3} />
        <Mock.CodeBlock seed="editor/sql" lines={9} />
        {/* 底部：执行选项 tag 行 + 输出预览（仿 gallery 底部样式） */}
        <div className="nebula--Mock-Editor__variants">
          <Mock.Tag width="38px" variant="accent" />
          <Mock.Tag width="46px" />
          <Mock.Tag width="32px" />
          <Mock.Tag width="40px" />
        </div>
        <div className="nebula--Mock-Editor__output">
          <Mock.CodeBlock seed="editor/out" lines={4} showLineNumbers={false} />
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

function TerminalScene() {
  return (
    <Mock.Window dots>
      <Mock.Body padding="8px" gap="0">
        <Mock.Terminal seed="terminal/term" lines={18} prompt="❯" />
      </Mock.Body>
    </Mock.Window>
  );
}

function WorkflowScene() {
  return (
    <Mock.Window>
      <Mock.Sidebar
        seed="flow/sidebar"
        items={6}
        width={SIDEBAR_WIDTH}
        activeIndex={SIDEBAR_ACTIVE}
      />
      <Mock.Body padding="8px" gap="0">
        <Mock.Flow />
      </Mock.Body>
    </Mock.Window>
  );
}

// blocks：选择器 —— 画布上散落 8 个块，1 个 active（neon 渐变 + 描边 + 外发光），
// 其余 = 灰阶弱色。无 pin，靠"是否发光"区分选中
function BlocksScene() {
  const blocks: { x: number; y: number; w: number; h: number; active?: boolean }[] = [
    { x: 8, y: 12, w: 28, h: 22 },
    { x: 42, y: 8, w: 18, h: 18 },
    { x: 66, y: 14, w: 22, h: 14 },
    { x: 12, y: 44, w: 16, h: 26 },
    { x: 36, y: 36, w: 30, h: 34, active: true },
    { x: 72, y: 50, w: 18, h: 22 },
    { x: 14, y: 76, w: 22, h: 12 },
    { x: 54, y: 78, w: 14, h: 10 },
  ];
  return (
    <Mock.Window>
      <Mock.Body padding="0" gap="0">
        <div className="nebula--Mock-Blocks">
          {/* 装饰网格线 */}
          <span
            className="nebula--Mock-Blocks__line nebula--Mock-Blocks__line--h"
            style={{ top: "36%" }}
          />
          <span
            className="nebula--Mock-Blocks__line nebula--Mock-Blocks__line--h"
            style={{ top: "74%" }}
          />
          <span
            className="nebula--Mock-Blocks__line nebula--Mock-Blocks__line--v"
            style={{ left: "32%" }}
          />
          <span
            className="nebula--Mock-Blocks__line nebula--Mock-Blocks__line--v"
            style={{ left: "68%" }}
          />
          {/* 块 */}
          {blocks.map((b, i) => (
            <div
              key={i}
              className={`nebula--Mock-Blocks__block${b.active ? " is-active" : ""}`}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            />
          ))}
        </div>
        {/* 底部 legend */}
        <div className="nebula--Mock-Blocks__legend">
          <Mock.Tag width="48px" />
          <Mock.Tag width="36px" />
          <Mock.Tag width="40px" />
          <div style={{ flex: 1 }} />
          <Mock.Tag width="32px" />
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// widgets：组件库首页 —— 顶部标题，下方 1 行 3 张大 widget 卡片
function WidgetsScene() {
  return (
    <Mock.Window>
      <Mock.Body padding="12px" gap="10px">
        {/* 顶部标题 */}
        <div className="nebula--Mock-Widgets__hero">
          <Mock.TextLines seed="widget/h" lines={1} widthRange={[40, 50]} />
          <Mock.Tag width="32px" />
        </div>
        {/* 3 张大卡片 */}
        <div className="nebula--Mock-Widgets__row">
          {/* 卡 1：button */}
          <div className="nebula--Mock-Widgets__card">
            <div className="nebula--Mock-Widgets__preview">
              <Mock.Button width="52px" />
            </div>
            <span className="nebula--Mock-Widgets__title" />
            <span className="nebula--Mock-Widgets__desc" />
          </div>
          {/* 卡 2：chip 组 */}
          <div className="nebula--Mock-Widgets__card">
            <div className="nebula--Mock-Widgets__preview">
              <div style={{ display: "flex", gap: 4 }}>
                <Mock.Tag width="22px" variant="accent" />
                <Mock.Tag width="22px" />
                <Mock.Tag width="22px" variant="accent" />
              </div>
            </div>
            <span className="nebula--Mock-Widgets__title" />
            <span className="nebula--Mock-Widgets__desc" />
          </div>
          {/* 卡 3：3 行 input */}
          <div className="nebula--Mock-Widgets__card">
            <div className="nebula--Mock-Widgets__preview nebula--Mock-Widgets__preview--stack">
              <span className="nebula--Mock-Widgets__input" />
              <span className="nebula--Mock-Widgets__input" />
              <span className="nebula--Mock-Widgets__input" />
            </div>
            <span className="nebula--Mock-Widgets__title" />
            <span className="nebula--Mock-Widgets__desc" />
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// ============================================================
// 左右分栏家族 —— 共享 .nebula--Mock-SplitPane（左列表 / 右详情）
// ============================================================

// chat：IM 对话 —— 左侧窄会话列表（avatar + name + 未读 dot），右侧气泡线程
function ChatScene() {
  // 左侧只放 avatar + 一条 name + 可选 dot —— 宽度对齐其他 sidebar（SIDEBAR_WIDTH 22%）
  const convs: { nameW: string; unread?: boolean; active?: boolean }[] = [
    { nameW: "70%", unread: true },
    { nameW: "60%", active: true },
    { nameW: "78%" },
    { nameW: "55%" },
    { nameW: "68%" },
    { nameW: "50%" },
  ];
  // 右侧气泡：side="l" 对方 / side="r" 自己；w 宽度参差，h 高度模拟单/多行消息
  const bubbles: { side: "l" | "r"; w: number; h: number }[] = [
    { side: "l", w: 48, h: 12 },
    { side: "r", w: 32, h: 12 },
    { side: "l", w: 72, h: 22 }, // 长消息
    { side: "r", w: 26, h: 12 },
    { side: "l", w: 38, h: 12 },
    { side: "r", w: 58, h: 22 }, // 长消息
    { side: "l", w: 44, h: 12 },
    { side: "r", w: 30, h: 12 },
    { side: "l", w: 62, h: 12 },
  ];
  return (
    <Mock.Window>
      <Mock.Body padding="0" gap="0">
        <div className="nebula--Mock-Split">
          {/* 左：窄会话列表（22% 宽，对齐其他 sidebar） */}
          <div className="nebula--Mock-Split__left nebula--Mock-Split__left--sidebar">
            {convs.map((c, i) => (
              <div key={i} className={`nebula--Mock-Chat__conv${c.active ? " is-active" : ""}`}>
                <Mock.Avatar seed={`chat/av/${i}`} size="14px" />
                <span className="nebula--Mock-Chat__convName" style={{ width: c.nameW }} />
                {c.unread && <span className="nebula--Mock-Chat__dot" />}
              </div>
            ))}
          </div>
          {/* 右：气泡对话 */}
          <div className="nebula--Mock-Split__right nebula--Mock-Chat__thread">
            {bubbles.map((b, i) => (
              <div
                key={i}
                className={`nebula--Mock-Chat__bubble is-${b.side}`}
                style={{ width: `${b.w}%`, height: `${b.h}px` }}
              />
            ))}
            {/* 输入框 */}
            <div className="nebula--Mock-Chat__inputBar">
              <span className="nebula--Mock-Chat__input" />
              <Mock.Button width="32px" />
            </div>
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// ============================================================
// 扩展场景：checkout / console(Jira 风) / gallery / pricing / logs
// ============================================================

// gallery：图集 —— 12 格 masonry-ish（行高不等），顶部 tag filter；偏 sunrise park（设施 / 场地照片墙）
function GalleryScene() {
  // 12 格用模式数组写死跨格（hSpan: 1 / 2 表示占 1 行或 2 行），保证视觉错落
  const tiles: { hSpan: 1 | 2; accent?: boolean }[] = [
    { hSpan: 2, accent: true },
    { hSpan: 1 },
    { hSpan: 1 },
    { hSpan: 1 },
    { hSpan: 2 },
    { hSpan: 1 },
    { hSpan: 1, accent: true },
    { hSpan: 1 },
    { hSpan: 2 },
    { hSpan: 1 },
    { hSpan: 1 },
    { hSpan: 1 },
  ];
  return (
    <Mock.Window>
      <Mock.Body padding="8px" gap="6px">
        {/* 顶部 tag filter */}
        <div className="nebula--Mock-Gallery__filter">
          <Mock.Tag width="40px" variant="accent" />
          <Mock.Tag width="32px" />
          <Mock.Tag width="36px" />
          <Mock.Tag width="28px" />
          <Mock.Tag width="34px" />
          <div style={{ flex: 1 }} />
          <Mock.Tag width="24px" />
          <Mock.Tag width="24px" />
        </div>
        {/* masonry 网格 */}
        <div className="nebula--Mock-Gallery__grid">
          {tiles.map((t, i) => (
            <span
              key={i}
              className={`nebula--Mock-Gallery__tile${t.accent ? " is-accent" : ""}`}
              style={{ gridRow: `span ${t.hSpan}` }}
            />
          ))}
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// campus：园区俯瞰图（仿 SAGA Sunrise Park 预约站首屏）
// 顶 4 tab，左工具区（2 按钮 + 说明段落 + 翻页），右"施設マップ" 标题 + 俯瞰图 + mini-map
function CampusScene() {
  // 4 tab，第 3 个 active（对照截图：SAGA スタ等屋外施設 选中）
  const tabs = [0, 1, 2, 3];
  const activeTab = 2;
  return (
    <Mock.Window>
      <Mock.Body padding="0" gap="0">
        <div className="nebula--Mock-Campus">
          {/* 顶部 4 tab —— 纯填充块（active = primary 渐变发光 / 其它 = muted 灰），跟左侧两按钮同款 */}
          <div className="nebula--Mock-Campus__tabs">
            {tabs.map((i) => (
              <span
                key={i}
                className={`nebula--Mock-Campus__tab${i === activeTab ? " is-active" : ""}`}
              />
            ))}
          </div>
          {/* 主体：左右分栏 */}
          <div className="nebula--Mock-Campus__main">
            {/* 左：工具区 */}
            <div className="nebula--Mock-Campus__tools">
              <div className="nebula--Mock-Campus__btnRow">
                <span className="nebula--Mock-Campus__btn is-primary" />
                <span className="nebula--Mock-Campus__btn is-muted" />
              </div>
              {/* 大 item 列表：左假方块（图片位，走 gallery tile 同款灰渐变）+ 右 2-3 行文字 */}
              <div className="nebula--Mock-Campus__items">
                {[
                  { lines: [82, 60], active: false },
                  { lines: [88, 70, 50], active: true },
                  { lines: [78, 56], active: false },
                  { lines: [86, 64, 44], active: false },
                ].map((it, i) => (
                  <div
                    key={i}
                    className={`nebula--Mock-Campus__item${it.active ? " is-active" : ""}`}
                  >
                    <span className="nebula--Mock-Campus__itemThumb" />
                    <div className="nebula--Mock-Campus__itemText">
                      {it.lines.map((w, k) => (
                        <span
                          key={k}
                          className="nebula--Mock-Campus__itemLine"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              {/* 翻页箭头 */}
              <div className="nebula--Mock-Campus__pager">
                <span className="nebula--Mock-Campus__pagerBtn" />
                <span className="nebula--Mock-Campus__pagerBtn is-active" />
              </div>
            </div>
            {/* 右：地图区 */}
            <div className="nebula--Mock-Campus__mapWrap">
              {/* 俯瞰图：就是一块 gallery tile —— 不画园区、不画网格 */}
              <div className="nebula--Mock-Campus__map">
                {/* 右下角 mini-map —— 同样一块方块，走 accent 渐变跟主体灰拉开层次 */}
                <div className="nebula--Mock-Campus__mini" />
              </div>
            </div>
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// diff：代码 diff —— 顶部文件 tabs，左旧 / 右新；每行 add / del / ctx / gap（gap 半透明占位）
function DiffScene() {
  type Role = "" | "add" | "del" | "gap";
  // 16 行 diff：多段穿插上下文 + 删/增改动，覆盖更密
  const rows: { left: Role; right: Role; lw: number; rw: number }[] = [
    { left: "", right: "", lw: 70, rw: 70 },
    { left: "", right: "", lw: 85, rw: 85 },
    { left: "del", right: "gap", lw: 60, rw: 60 },
    { left: "gap", right: "add", lw: 65, rw: 65 },
    { left: "gap", right: "add", lw: 75, rw: 75 },
    { left: "", right: "", lw: 50, rw: 50 },
    { left: "", right: "", lw: 78, rw: 78 },
    { left: "del", right: "gap", lw: 72, rw: 72 },
    { left: "del", right: "gap", lw: 55, rw: 55 },
    { left: "gap", right: "add", lw: 80, rw: 80 },
    { left: "", right: "", lw: 64, rw: 64 },
    { left: "", right: "", lw: 90, rw: 90 },
    { left: "del", right: "gap", lw: 45, rw: 45 },
    { left: "gap", right: "add", lw: 70, rw: 70 },
    { left: "gap", right: "add", lw: 55, rw: 55 },
    { left: "", right: "", lw: 82, rw: 82 },
  ];
  return (
    <Mock.Window dots>
      <Mock.Body padding="0" gap="0">
        {/* 顶部文件 tab 条 */}
        <div className="nebula--Mock-Diff__bar">
          <Mock.Tag width="90px" variant="accent" />
          <Mock.Tag width="62px" />
          <Mock.Tag width="48px" />
          <div style={{ flex: 1 }} />
          <span className="nebula--Mock-Diff__stat is-add" />
          <span className="nebula--Mock-Diff__stat is-del" />
          <Mock.Tag width="24px" />
        </div>
        {/* 左右两栏 */}
        <div className="nebula--Mock-Split nebula--Mock-Diff__split">
          {/* 左：旧 */}
          <div className="nebula--Mock-Split__left nebula--Mock-Diff__pane">
            {rows.map((r, i) => (
              <div key={i} className={`nebula--Mock-Diff__line${r.left ? ` is-${r.left}` : ""}`}>
                <span className="nebula--Mock-Diff__num">{i + 1}</span>
                <span className="nebula--Mock-Diff__code" style={{ width: `${r.lw}%` }} />
              </div>
            ))}
          </div>
          {/* 右：新 */}
          <div className="nebula--Mock-Split__right nebula--Mock-Diff__pane">
            {rows.map((r, i) => (
              <div key={i} className={`nebula--Mock-Diff__line${r.right ? ` is-${r.right}` : ""}`}>
                <span className="nebula--Mock-Diff__num">{i + 1}</span>
                <span className="nebula--Mock-Diff__code" style={{ width: `${r.rw}%` }} />
              </div>
            ))}
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}
