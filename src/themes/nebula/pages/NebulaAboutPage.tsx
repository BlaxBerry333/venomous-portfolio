import { ThemeNebula } from "@/themes/nebula/base";
import {
  getLocalizedUrl,
  type AboutPageContent,
  type AboutSignature,
  type Locale,
} from "@/utils/i18n";
import type { Theme } from "@/utils/themes";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  content: AboutPageContent;
  locale: Locale;
  theme: Theme;
}

export default function NebulaAboutPage({ content, locale, theme }: Props) {
  const { sectionIntroduction, sectionTimeline, timeline } = content;
  const { title, description, viewWorksText, signature } = sectionIntroduction;

  const worksUrl = getLocalizedUrl("/works", locale, theme);
  const homeUrl = getLocalizedUrl("/", locale, theme);

  return (
    <>
      {/* 1. Introduction */}
      <ThemeNebula.Section
        title={title}
        titleLevel={1}
        actions={[
          <ThemeNebula.Button href={worksUrl} style={{ justifyContent: "center" }}>
            {viewWorksText}
          </ThemeNebula.Button>,
          <ThemeNebula.Button
            href={import.meta.env.PUBLIC_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ justifyContent: "center" }}
          >
            Github
          </ThemeNebula.Button>,
        ]}
      >
        <AboutIntroduction signature={signature} description={description} />
      </ThemeNebula.Section>

      {/* 2. Timeline */}
      <ThemeNebula.Section
        title={timeline.title}
        titleLevel={2}
        actions={[
          <ThemeNebula.Button href={homeUrl}>{sectionTimeline.viewHomeText}</ThemeNebula.Button>,
        ]}
      >
        <ThemeNebula.Timeline locale={locale} theme={theme} items={timeline.items} />
      </ThemeNebula.Section>
    </>
  );
}

/**
 * Introduction 内容布局：左列蜂巢签名 + 右列三段自述 + 操作区（children）。
 * Section 外壳（title / titleLevel）保留在调用方，让本组件只负责"自我介绍区的内部排版"。
 * children 完全由调用方注入：可以是单按钮、按钮组、Grid 包裹等任意结构。
 */
function AboutIntroduction({
  signature,
  description,
  children,
}: {
  signature: AboutSignature;
  description: string[];
  children?: ReactNode;
}) {
  return (
    <div style={introStyle}>
      <div style={signatureColStyle}>
        <SignatureCluster signature={signature} />
      </div>
      <div style={textColStyle}>
        <div style={paragraphsStyle}>
          {description.map((p, i) => (
            <p key={i} style={paragraphStyle}>
              {p}
            </p>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

// 两列布局：≥320px 单列、桌面自动塌成两列。
// inline 不便写 @media，用 auto-fit + minmax 让浏览器自决。
// align-items: start 让签名块顶部和段落顶部对齐（之前是 center → 视觉上签名偏下）
const introStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  alignItems: "start",
  gap: "var(--space-8)",
};

const signatureColStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const textColStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-6)",
};

const paragraphsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
  maxWidth: "60ch",
};

const paragraphStyle: CSSProperties = {
  fontSize: "clamp(16px, 1.6vw, 19px)",
  lineHeight: 1.75,
  color: "var(--nebula-color-text)",
  margin: 0,
};

// 签名块：lg（CHEN + Tokyo）居中、左偏；两个 sm 分别右上/右下咬合
// 尺寸常量来自 HiveCellCard：lg 184×212.46、sm 120×138.56
// 容器宽 = lg_w + sm_w×0.6 ≈ 256；高 = lg_h + sm_h ≈ 280（上下各让出半个 sm）
const SIG_W = 256;
const SIG_H = 280;

const signatureStyle: CSSProperties = {
  position: "relative",
  width: SIG_W,
  height: SIG_H,
};

// lg 在容器中：水平偏左（让出右侧给两个 sm），垂直居中
const lgWrapStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
};

// 右上 sm：与 lg 右上斜边咬合 —— right: 0, top: 0
const smTopRightStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  top: 0,
};

// 右下 sm：与 lg 右下斜边咬合 —— right: 0, bottom: 0
const smBottomRightStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: 0,
};

function SignatureCluster({ signature }: { signature: AboutSignature }) {
  // areas[0] = 全栈（右下），areas[1] = 设计（右上）
  // 数据顺序 → 视觉顺序的映射在这里固定，i18n 不必反向写
  const [areaBottom, areaTop] = signature.areas;

  return (
    <div style={signatureStyle} aria-label={signature.name}>
      {/* 左主：大 lg，CHEN + 地点 */}
      <div style={lgWrapStyle}>
        <ThemeNebula.HiveCellCard
          size="lg"
          variant="solid"
          tilt
          title={signature.name}
          subtitle={signature.place}
        />
      </div>
      {/* 右上 sm */}
      {areaTop && (
        <div style={smTopRightStyle}>
          <ThemeNebula.HiveCellCard size="sm" variant="outline" tilt={false} title={areaTop} />
        </div>
      )}
      {/* 右下 sm */}
      {areaBottom && (
        <div style={smBottomRightStyle}>
          <ThemeNebula.HiveCellCard size="sm" variant="outline" tilt={false} title={areaBottom} />
        </div>
      )}
    </div>
  );
}
