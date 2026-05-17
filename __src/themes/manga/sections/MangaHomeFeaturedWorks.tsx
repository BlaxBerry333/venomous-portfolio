import SitePageSection from "@/components/react/layout/SitePageSection";
import type { Work } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MangaUI } from "../components";
import "./MangaHomeFeaturedWorks.scss";

// 简易 useMediaQuery — hydration 安全：SSR 和 CSR 首帧均返回 false（PC 分支），
// mount 后再读真实值。否则 SSR=PC、CSR 首帧=mobile 时 DOM 结构不一致会触发 hydration 报错。
function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatch(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return match;
}

// Manga Featured：
// - 布局：移动端单卡（preview + 简略信息）；PC 端左 preview Card / 右三 Card（基础信息 / 技术 Tags / 贡献说明）
// - 翻页特效：F3 分镜抛落（无白屏，背景始终是页面渐变）
// - 翻页按钮：P2 底部一排（左 ◀ + 页码点 + 右 ▶）

const COVER_COLOR_CYCLE = ["white", "red", "yellow"] as const;
type CoverColor = (typeof COVER_COLOR_CYCLE)[number];

function cardPalette(c: CoverColor): { bg: string; fg: string } {
  switch (c) {
    case "red":
      return { bg: "var(--theme-accent)", fg: "var(--theme-fg)" };
    case "yellow":
      return { bg: "var(--theme-accent-2)", fg: "var(--theme-fg)" };
    case "white":
    default:
      return { bg: "var(--theme-bg)", fg: "var(--theme-fg)" };
  }
}

// F3 分镜抛落 — role 控制 stagger / 静止角度
function tossPreset(dir: 1 | -1, role: "left" | "right1" | "right2" | "right3" | "mobile") {
  const stagger =
    role === "left"
      ? 0
      : role === "right1"
        ? 0.06
        : role === "right2"
          ? 0.12
          : role === "right3"
            ? 0.18
            : 0;
  const restRot =
    role === "left"
      ? -1.5
      : role === "right1"
        ? 1.2
        : role === "right2"
          ? 0
          : role === "right3"
            ? 0.8
            : -0.6;
  return {
    initial: { opacity: 0, y: -28, rotate: restRot + dir * 6 },
    animate: {
      opacity: 1,
      y: 0,
      rotate: restRot,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: stagger },
    },
    exit: {
      opacity: 0,
      y: 24,
      rotate: restRot - dir * 4,
      transition: { duration: 0.3, ease: "easeIn" },
    },
    restRot,
  };
}

interface MangaHomeFeaturedWorksProps {
  locale: Locale;
  theme: Theme;
}

export default function MangaHomeFeaturedWorks({ locale, theme }: MangaHomeFeaturedWorksProps) {
  const allWorks = useWorks(locale);
  const works = useMemo(() => allWorks.slice(0, 4), [allWorks]);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const w = works[page];
  const cardColor = COVER_COLOR_CYCLE[page % COVER_COLOR_CYCLE.length];
  const detailUrl = getLocalizedUrl(`/works/${w.id}`, locale, theme);
  const worksListUrl = getLocalizedUrl("/works", locale, theme);

  const goto = (n: number) => {
    let next = n;
    if (next < 0) next = works.length - 1;
    if (next >= works.length) next = 0;
    setDir(next > page || (page === works.length - 1 && next === 0) ? 1 : -1);
    setPage(next);
  };

  const left = tossPreset(dir, "left");
  const r1 = tossPreset(dir, "right1");
  const r2 = tossPreset(dir, "right2");
  const r3 = tossPreset(dir, "right3");
  const mobile = tossPreset(dir, "mobile");

  return (
    <SitePageSection
      style={{
        minHeight: "100vh",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-2xl)",
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: "var(--space-2xl)",
        }}
      >
        <MangaUI.Title1 eyebrow="卷一" animate="spring">
          FEATURED WORKS
        </MangaUI.Title1>
      </header>

      {/* JS 判断 PC / 移动端，避免双 DOM */}
      {isMobile ? (
        <div
          style={{
            paddingLeft: 8,
            paddingRight: 8,
            height: 500,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`M-${page}`}
              initial={mobile.initial}
              animate={mobile.animate}
              exit={mobile.exit}
            >
              <MobileCompactCard
                work={w}
                cardColor={cardColor}
                pageIndex={page}
                restRotate={mobile.restRot}
                detailUrl={detailUrl}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
            gap: 28,
            alignItems: "stretch",
            // 固定外层高度 — 切换不同 work 时下方按钮保持相同 y 位置
            height: 600,
          }}
        >
          {/* PC 左：仅 preview Card — 不撑满列高，按固定尺寸居中 */}
          <div
            style={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`L-${page}`}
                initial={left.initial}
                animate={left.animate}
                exit={left.exit}
                style={{ display: "flex" }}
              >
                <PreviewCard
                  work={w}
                  cardColor={cardColor}
                  pageIndex={page}
                  restRotate={left.restRot}
                  detailUrl={detailUrl}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* PC 右：三个 Card 纵向 — 不固定高度，按 5% 间距分布 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5%",
              minWidth: 0,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`R1-${page}`}
                initial={r1.initial}
                animate={r1.animate}
                exit={r1.exit}
                style={{ flex: 1, display: "flex" }}
              >
                <CardBasicInfo work={w} restRotate={r1.restRot} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`R2-${page}`}
                initial={r2.initial}
                animate={r2.animate}
                exit={r2.exit}
                style={{ display: "flex", flex: "0 0 auto" }}
              >
                <CardTechStack work={w} restRotate={r2.restRot} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`R3-${page}`}
                initial={r3.initial}
                animate={r3.animate}
                exit={r3.exit}
                style={{ flex: 1, display: "flex" }}
              >
                <CardContribution work={w} restRotate={r3.restRot} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 底部一排：◀ ●●●● ▶ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 32,
          flexWrap: "wrap",
        }}
      >
        <MangaUI.Button
          onClick={() => goto(page - 1)}
          aria-label="Previous"
          color="black"
          size="sm"
          restRotate={-2}
          style={{ minWidth: 48 }}
        >
          {"<"}
        </MangaUI.Button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {works.map((_, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              aria-label={`Page ${i + 1}`}
              style={{
                width: i === page ? 36 : 14,
                height: 12,
                background: i === page ? "var(--theme-accent)" : "var(--theme-fg)",
                border: "2px solid var(--theme-fg)",
                cursor: "pointer",
                transition: "width 200ms",
              }}
            />
          ))}
        </div>
        <MangaUI.Button
          onClick={() => goto(page + 1)}
          aria-label="Next"
          color="red"
          size="sm"
          restRotate={2}
          style={{ minWidth: 48 }}
        >
          {">"}
        </MangaUI.Button>
      </div>

      {/* View All — 进度条下方 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <a href={worksListUrl} style={{ textDecoration: "none", color: "inherit" }}>
          <MangaUI.Button color="yellow" size="md" restRotate={-1}>
            VIEW ALL →
          </MangaUI.Button>
        </a>
      </div>
    </SitePageSection>
  );
}

// ─────────────────────────────────────────────────────────────────
// PC 左：仅 preview（封面 + 极简标题块）；hover 时遮罩按钮"查看详情"
// ─────────────────────────────────────────────────────────────────
function PreviewCard({
  work,
  cardColor,
  pageIndex,
  restRotate,
  detailUrl,
}: {
  work: Work;
  cardColor: CoverColor;
  pageIndex: number;
  restRotate: number;
  detailUrl: string;
}) {
  const isDraft = work.demoType === "nda";
  const badgeText = isDraft ? "機密" : work.category === "company" ? "公式" : "独立";
  const badgeColor: "red" | "yellow" = pageIndex % 2 === 0 ? "red" : "yellow";

  // PC preview 走 components 页 "Custom Container · Dossier" 形态：
  // padding=0 / 封面铺整张 Card 背景 / 自定 halftone 顶层 / 顶角章 / 不放 titleblock
  // 固定尺寸 — 不撑满列高，由外层容器负责居中
  return (
    <MangaUI.Card
      color={cardColor}
      padding={0}
      minHeight={0}
      borderWidth={5}
      shadowOffset={12}
      shadowColor="var(--theme-accent)"
      restRotate={restRotate}
      topBadge={{ text: badgeText, color: badgeColor }}
      className="portfolio__manga-home-featured-works__preview"
      style={{
        width: 520,
        height: 420,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 内层裁切容器 — Card 因 badge 关闭了 overflow，需要自己裁封面/halftone/遮罩 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {/* 封面背景层 — 单独吃 blur/grayscale */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(14,14,16,0.6)), url(${work.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: isDraft ? "blur(10px) grayscale(0.6)" : "none",
            transform: isDraft ? "scale(1.1)" : "none",
            zIndex: 0,
          }}
        />
        {/* halftone 网点层 — 放在封面之上 */}
        <div
          aria-hidden
          className="manga-ui--halftone"
          style={{
            position: "absolute",
            inset: 0,
            color: "rgba(14,14,16,0.4)",
            mixBlendMode: "multiply",
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {/* hover 遮罩 + 查看详情按钮 */}
        <div
          className="portfolio__manga-home-featured-works__preview-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(14,14,16,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 200ms ease",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          <a
            href={detailUrl}
            aria-label="查看详细信息"
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "12px 22px",
              background: "var(--theme-accent)",
              color: "var(--theme-fg)",
              border: "3px solid var(--theme-fg)",
              boxShadow: "6px 6px 0 var(--theme-fg)",
              cursor: "pointer",
              transform: "rotate(-2deg)",
              pointerEvents: "auto",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            查看详细 →
          </a>
        </div>
      </div>
    </MangaUI.Card>
  );
}

// ─────────────────────────────────────────────────────────────────
// PC 右上：基础信息（标题 / 副标 / 角色）
// ─────────────────────────────────────────────────────────────────
function CardBasicInfo({ work, restRotate }: { work: Work; restRotate: number }) {
  return (
    <MangaUI.Card
      color="white"
      padding={24}
      minHeight={0}
      borderWidth={4}
      shadowOffset={8}
      restRotate={restRotate}
      topBadge={{ text: "STAGE 01 · 基本", color: "black", rotate: -6 }}
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "14px 24px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--theme-font-display)",
          fontWeight: 900,
          fontSize: 22,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          lineHeight: 1.1,
          color: "var(--theme-fg)",
        }}
      >
        {work.title}
      </p>
      <p
        style={{
          margin: 0,
          marginTop: 6,
          fontFamily: "var(--theme-font-body)",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--theme-fg-muted)",
          lineHeight: 1.45,
        }}
      >
        {work.subtitle}
      </p>
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "2px dashed var(--theme-fg)",
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--theme-font-display)",
            fontSize: 10,
            letterSpacing: "0.3em",
            fontWeight: 900,
            color: "var(--theme-fg-muted)",
          }}
        >
          ROLE
        </span>
        <span
          style={{
            fontFamily: "var(--theme-font-body)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--theme-fg)",
            lineHeight: 1.4,
          }}
        >
          {work.myRole}
        </span>
      </div>
    </MangaUI.Card>
  );
}

// ─────────────────────────────────────────────────────────────────
// PC 右中：技术栈（用 Tag）
// ─────────────────────────────────────────────────────────────────
function CardTechStack({ work, restRotate }: { work: Work; restRotate: number }) {
  return (
    <MangaUI.Card
      color="white"
      padding={24}
      minHeight={0}
      borderWidth={4}
      shadowOffset={8}
      restRotate={restRotate}
      topBadge={{ text: "STACK · 必殺技", color: "red", rotate: -4 }}
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "14px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          // 给右下角 +N MORE 角注预留空间，避免 tag 末尾与之相撞
          paddingRight: 80,
          paddingTop: 18,
        }}
      >
        {work.techStack.map((t, i) => (
          <MangaUI.Tag key={t} color="black" size="sm" restRotate={(i % 3) - 1}>
            {t}
          </MangaUI.Tag>
        ))}
      </div>
      {/* 右下角"还有更多"角注 — 与 Skill Codex 同款样式（统一感） */}
      <span aria-hidden className="manga-more-corner">
        +12 MORE
      </span>
    </MangaUI.Card>
  );
}

// ─────────────────────────────────────────────────────────────────
// PC 右下：贡献说明（contribution）— 编号改 Tag，行距大，内容截断带省略号
// ─────────────────────────────────────────────────────────────────
function truncate(s: string, n = 28) {
  return s.length > n ? s.slice(0, n).replace(/[，。,.\s]+$/, "") + "..." : s;
}
function CardContribution({ work, restRotate }: { work: Work; restRotate: number }) {
  const items = work.contributions.slice(0, 3);
  return (
    <MangaUI.Card
      color="white"
      padding={24}
      minHeight={0}
      borderWidth={4}
      shadowOffset={8}
      restRotate={restRotate}
      topBadge={{ text: "CONTRIB · 担当", color: "yellow", rotate: -3 }}
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "14px 24px",
      }}
    >
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {items.map((c, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--theme-font-body)",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--theme-fg)",
              lineHeight: 1.45,
            }}
          >
            <MangaUI.Tag color="black" size="sm" restRotate={(i - 1) * 3} style={{ flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </MangaUI.Tag>
            <span style={{ flex: 1 }}>{truncate(c, 28)}</span>
          </li>
        ))}
      </ul>
    </MangaUI.Card>
  );
}

// ─────────────────────────────────────────────────────────────────
// 移动端：单 Card — preview + 简略信息（标题 / 副标 / 3 个 tag）
// 控制总高：封面 16/9，标题块紧凑，最多 3 个 tag
// ─────────────────────────────────────────────────────────────────
function MobileCompactCard({
  work,
  cardColor,
  pageIndex,
  restRotate,
  detailUrl,
}: {
  work: Work;
  cardColor: CoverColor;
  pageIndex: number;
  restRotate: number;
  detailUrl: string;
}) {
  const palette = cardPalette(cardColor);
  const isDraft = work.demoType === "nda";
  const badgeText = isDraft ? "機密" : work.category === "company" ? "公式" : "独立";
  const badgeColor: "red" | "yellow" = pageIndex % 2 === 0 ? "red" : "yellow";
  const stackShown = work.techStack.slice(0, 4);
  const stackRest = Math.max(0, work.techStack.length - stackShown.length);

  return (
    <MangaUI.Card
      color={cardColor}
      padding={0}
      minHeight={0}
      borderWidth={4}
      shadowOffset={10}
      restRotate={restRotate}
      topBadge={{ text: badgeText, color: badgeColor }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "var(--theme-fg)",
        }}
      >
        {/* 背景图独立层 — 仅这层吃 blur */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(14,14,16,0.6)), url(${work.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: isDraft ? "blur(10px) grayscale(0.6)" : "none",
            transform: isDraft ? "scale(1.1)" : "none",
          }}
        />
        <div
          aria-hidden
          className="manga-ui--halftone"
          style={{
            position: "absolute",
            inset: 0,
            color: "rgba(14,14,16,0.4)",
            mixBlendMode: "multiply",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          borderTop: "4px solid var(--theme-fg)",
          padding: "14px 16px",
          background: palette.bg,
          color: palette.fg,
        }}
      >
        {/* 标题（Title3 自带底部 3px 分隔实线） */}
        <MangaUI.Title3 size={20} style={{ marginBottom: 0 }}>
          {work.title}
        </MangaUI.Title3>
        {/* 副标 — 单行 ellipsis 防止换行抬高 Card */}
        <p
          style={{
            margin: 0,
            marginTop: 4,
            fontFamily: "var(--theme-font-body)",
            fontWeight: 700,
            fontSize: 12,
            color: palette.fg,
            opacity: 0.75,
            lineHeight: 1.35,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {work.subtitle}
        </p>
        {/* MAIN STACK Tags — 容器固定 2 行高度，tag 自动换行；+N MORE 角注 absolute 到右下角 */}
        <div
          style={{
            position: "relative",
            marginTop: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: 6,
              fontFamily: "var(--theme-font-display)",
              fontSize: 9,
              letterSpacing: "0.3em",
              fontWeight: 900,
              color: palette.fg,
              opacity: 0.6,
            }}
          >
            MAIN STACK
          </p>
          {/* tag 区：2 行高度固定，wrap 折叠；右下留 paddingRight 给角注让位 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: 6,
              minHeight: 56,
              paddingRight: 64,
            }}
          >
            {stackShown.map((t, i) => (
              <MangaUI.Tag
                key={t}
                color={cardColor === "red" || (cardColor as string) === "black" ? "white" : "black"}
                size="xs"
                restRotate={(i % 3) - 1}
              >
                {t}
              </MangaUI.Tag>
            ))}
          </div>
          {stackRest > 0 && (
            <span aria-hidden className="portfolio__manga-home-featured-works__more-corner">
              +{stackRest} MORE
            </span>
          )}
        </div>
        {/* ROLE 块（下）— 单行 ellipsis，固定高度 */}
        <div
          style={{
            marginTop: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: 6,
              fontFamily: "var(--theme-font-display)",
              fontSize: 9,
              letterSpacing: "0.3em",
              fontWeight: 900,
              color: palette.fg,
              opacity: 0.6,
            }}
          >
            ROLE
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--theme-font-body)",
              fontSize: 12,
              fontWeight: 700,
              color: palette.fg,
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {work.myRole}
          </p>
        </div>
        {/* 查看更多按钮 */}
        <a
          href={detailUrl}
          aria-label="查看详细信息"
          style={{
            marginTop: 14,
            width: "100%",
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px 14px",
            background: "var(--theme-fg)",
            color: "var(--theme-bg)",
            border: `3px solid var(--theme-fg)`,
            boxShadow: "5px 5px 0 var(--theme-accent)",
            cursor: "pointer",
            transform: "rotate(-1deg)",
            display: "block",
            textAlign: "center",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          查看详细 →
        </a>
      </div>
    </MangaUI.Card>
  );
}
