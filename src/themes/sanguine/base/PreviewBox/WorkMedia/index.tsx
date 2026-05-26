import { type WorkPreviewCode } from "@/utils/i18n";
import Mock from "../Mock";
import "./index.scss";

/**
 * PreviewBox.WorkMedia —— work 卡片用的「假截图」预览。
 *
 * 与 nebula 的 WorkMedia 同构：收同一批 `previewCode`，渲染同一组可辨识的
 * UI 印象（仪表盘 / 编辑器 / 终端 …），只是换上 sanguine 的碑铭审美。
 *
 * 不传 previewCode 则不渲染。每个 previewCode 的画面 100% 固定
 * （内部 seed 写死成 previewCode 名），消费侧无法 / 无需调整任何细节。
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
    <div className="portfolio--sanguine-preview-work-media">
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
        {/* 底部：执行选项 tag 行 + 输出预览 */}
        <div className="sanguine--Mock-Editor__variants">
          <Mock.Tag width="38px" variant="accent" />
          <Mock.Tag width="46px" />
          <Mock.Tag width="32px" />
          <Mock.Tag width="40px" />
        </div>
        <div className="sanguine--Mock-Editor__output">
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
        <Mock.Terminal seed="terminal/term" lines={18} prompt="›" />
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

// blocks：选择器 —— 画布上散落 8 个块，1 个 active（灌红实色 + 红边），其余暗灰
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
        <div className="sanguine--Mock-Blocks">
          {/* 装饰网格线 */}
          <span
            className="sanguine--Mock-Blocks__line sanguine--Mock-Blocks__line--h"
            style={{ top: "36%" }}
          />
          <span
            className="sanguine--Mock-Blocks__line sanguine--Mock-Blocks__line--h"
            style={{ top: "74%" }}
          />
          <span
            className="sanguine--Mock-Blocks__line sanguine--Mock-Blocks__line--v"
            style={{ left: "32%" }}
          />
          <span
            className="sanguine--Mock-Blocks__line sanguine--Mock-Blocks__line--v"
            style={{ left: "68%" }}
          />
          {/* 块 */}
          {blocks.map((b, i) => (
            <div
              key={i}
              className={`sanguine--Mock-Blocks__block${b.active ? " is-active" : ""}`}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            />
          ))}
        </div>
        {/* 底部 legend */}
        <div className="sanguine--Mock-Blocks__legend">
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
        <div className="sanguine--Mock-Widgets__hero">
          <Mock.TextLines seed="widget/h" lines={1} widthRange={[40, 50]} />
          <Mock.Tag width="32px" />
        </div>
        {/* 3 张大卡片 */}
        <div className="sanguine--Mock-Widgets__row">
          {/* 卡 1：button */}
          <div className="sanguine--Mock-Widgets__card">
            <div className="sanguine--Mock-Widgets__preview">
              <Mock.Button width="52px" />
            </div>
            <span className="sanguine--Mock-Widgets__title" />
            <span className="sanguine--Mock-Widgets__desc" />
          </div>
          {/* 卡 2：tag 组 */}
          <div className="sanguine--Mock-Widgets__card">
            <div className="sanguine--Mock-Widgets__preview">
              <div style={{ display: "flex", gap: 4 }}>
                <Mock.Tag width="22px" variant="accent" />
                <Mock.Tag width="22px" />
                <Mock.Tag width="22px" variant="accent" />
              </div>
            </div>
            <span className="sanguine--Mock-Widgets__title" />
            <span className="sanguine--Mock-Widgets__desc" />
          </div>
          {/* 卡 3：3 行 input */}
          <div className="sanguine--Mock-Widgets__card">
            <div className="sanguine--Mock-Widgets__preview sanguine--Mock-Widgets__preview--stack">
              <span className="sanguine--Mock-Widgets__input" />
              <span className="sanguine--Mock-Widgets__input" />
              <span className="sanguine--Mock-Widgets__input" />
            </div>
            <span className="sanguine--Mock-Widgets__title" />
            <span className="sanguine--Mock-Widgets__desc" />
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// chat：IM 对话 —— 左侧窄会话列表（avatar + name + 未读记），右侧气泡线程
function ChatScene() {
  const convs: { nameW: string; unread?: boolean; active?: boolean }[] = [
    { nameW: "70%", unread: true },
    { nameW: "60%", active: true },
    { nameW: "78%" },
    { nameW: "55%" },
    { nameW: "68%" },
    { nameW: "50%" },
  ];
  const bubbles: { side: "l" | "r"; w: number; h: number }[] = [
    { side: "l", w: 48, h: 12 },
    { side: "r", w: 32, h: 12 },
    { side: "l", w: 72, h: 22 },
    { side: "r", w: 26, h: 12 },
    { side: "l", w: 38, h: 12 },
    { side: "r", w: 58, h: 22 },
    { side: "l", w: 44, h: 12 },
    { side: "r", w: 30, h: 12 },
    { side: "l", w: 62, h: 12 },
  ];
  return (
    <Mock.Window>
      <Mock.Body padding="0" gap="0">
        <div className="sanguine--Mock-Split">
          {/* 左：窄会话列表 */}
          <div className="sanguine--Mock-Split__left sanguine--Mock-Split__left--sidebar">
            {convs.map((c, i) => (
              <div key={i} className={`sanguine--Mock-Chat__conv${c.active ? " is-active" : ""}`}>
                <Mock.Avatar size="14px" />
                <span className="sanguine--Mock-Chat__convName" style={{ width: c.nameW }} />
                {c.unread && <span className="sanguine--Mock-Chat__dot" />}
              </div>
            ))}
          </div>
          {/* 右：气泡对话 */}
          <div className="sanguine--Mock-Split__right sanguine--Mock-Chat__thread">
            {bubbles.map((b, i) => (
              <div
                key={i}
                className={`sanguine--Mock-Chat__bubble is-${b.side}`}
                style={{ width: `${b.w}%`, height: `${b.h}px` }}
              />
            ))}
            {/* 输入框 */}
            <div className="sanguine--Mock-Chat__inputBar">
              <span className="sanguine--Mock-Chat__input" />
              <Mock.Button width="32px" />
            </div>
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// diff：代码 diff —— 顶部文件 tabs，左旧 / 右新；每行 add（绿）/ del（红）/ ctx / gap
function DiffScene() {
  type Role = "" | "add" | "del" | "gap";
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
        <div className="sanguine--Mock-Diff__bar">
          <Mock.Tag width="90px" variant="accent" />
          <Mock.Tag width="62px" />
          <Mock.Tag width="48px" />
          <div style={{ flex: 1 }} />
          <span className="sanguine--Mock-Diff__stat is-add" />
          <span className="sanguine--Mock-Diff__stat is-del" />
          <Mock.Tag width="24px" />
        </div>
        {/* 左右两栏 */}
        <div className="sanguine--Mock-Split sanguine--Mock-Diff__split">
          {/* 左：旧 */}
          <div className="sanguine--Mock-Split__left sanguine--Mock-Diff__pane">
            {rows.map((r, i) => (
              <div key={i} className={`sanguine--Mock-Diff__line${r.left ? ` is-${r.left}` : ""}`}>
                <span className="sanguine--Mock-Diff__num">{i + 1}</span>
                <span className="sanguine--Mock-Diff__code" style={{ width: `${r.lw}%` }} />
              </div>
            ))}
          </div>
          {/* 右：新 */}
          <div className="sanguine--Mock-Split__right sanguine--Mock-Diff__pane">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`sanguine--Mock-Diff__line${r.right ? ` is-${r.right}` : ""}`}
              >
                <span className="sanguine--Mock-Diff__num">{i + 1}</span>
                <span className="sanguine--Mock-Diff__code" style={{ width: `${r.rw}%` }} />
              </div>
            ))}
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// gallery：图集 —— 12 格 masonry，顶部 tag filter
function GalleryScene() {
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
        <div className="sanguine--Mock-Gallery__filter">
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
        <div className="sanguine--Mock-Gallery__grid">
          {tiles.map((t, i) => (
            <span
              key={i}
              className={`sanguine--Mock-Gallery__tile${t.accent ? " is-accent" : ""}`}
              style={{ gridRow: `span ${t.hSpan}` }}
            />
          ))}
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}

// campus：园区俯瞰图 —— 顶 4 tab，左工具区，右地图区
function CampusScene() {
  const tabs = [0, 1, 2, 3];
  const activeTab = 2;
  return (
    <Mock.Window>
      <Mock.Body padding="0" gap="0">
        <div className="sanguine--Mock-Campus">
          {/* 顶部 4 tab */}
          <div className="sanguine--Mock-Campus__tabs">
            {tabs.map((i) => (
              <span
                key={i}
                className={`sanguine--Mock-Campus__tab${i === activeTab ? " is-active" : ""}`}
              />
            ))}
          </div>
          {/* 主体：左右分栏 */}
          <div className="sanguine--Mock-Campus__main">
            {/* 左：工具区 */}
            <div className="sanguine--Mock-Campus__tools">
              <div className="sanguine--Mock-Campus__btnRow">
                <span className="sanguine--Mock-Campus__btn is-primary" />
                <span className="sanguine--Mock-Campus__btn is-muted" />
              </div>
              {/* 大 item 列表 */}
              <div className="sanguine--Mock-Campus__items">
                {[
                  { lines: [82, 60], active: false },
                  { lines: [88, 70, 50], active: true },
                  { lines: [78, 56], active: false },
                  { lines: [86, 64, 44], active: false },
                ].map((it, i) => (
                  <div
                    key={i}
                    className={`sanguine--Mock-Campus__item${it.active ? " is-active" : ""}`}
                  >
                    <span className="sanguine--Mock-Campus__itemThumb" />
                    <div className="sanguine--Mock-Campus__itemText">
                      {it.lines.map((w, k) => (
                        <span
                          key={k}
                          className="sanguine--Mock-Campus__itemLine"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              {/* 翻页 */}
              <div className="sanguine--Mock-Campus__pager">
                <span className="sanguine--Mock-Campus__pagerBtn" />
                <span className="sanguine--Mock-Campus__pagerBtn is-active" />
              </div>
            </div>
            {/* 右：地图区 */}
            <div className="sanguine--Mock-Campus__mapWrap">
              <div className="sanguine--Mock-Campus__map">
                <div className="sanguine--Mock-Campus__mini" />
              </div>
            </div>
          </div>
        </div>
      </Mock.Body>
    </Mock.Window>
  );
}
