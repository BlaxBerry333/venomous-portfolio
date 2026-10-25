import {
  DESIGN_SHOWCASE_ART_PROJECTS,
  DESIGN_SHOWCASE_GROUPS,
  DESIGN_SHOWCASE_TOKENS,
  DESIGN_SHOWCASE_VARIANTS,
} from "@/dev/mock/design/designShowcaseMock";
import * as Layout from "@/ui/layout";
import * as UI from "@/ui/shared/kit";
import * as Stage from "@/ui/shared/stage";
import * as Theme from "@/ui/themes";
import * as Dmc from "@/ui/themes/dmc";
import "@/ui/themes/tokens.scss";
import { useEffect, useState, type ReactNode } from "react";
import "./DesignShowcasePage.scss";
import designShowcasePhoto from "./designShowcasePhoto.jpg";

type DesignShowcaseTokenValues = Partial<Record<(typeof DESIGN_SHOWCASE_READ)[number], string>>;

const DESIGN_SHOWCASE_SWATCHES = [
  { name: "--theme-color-background", label: "背景" },
  { name: "--theme-color-surface", label: "表面" },
  { name: "--theme-color-text", label: "文字" },
  { name: "--theme-color-primary", label: "主色" },
  { name: "--theme-color-primary-light", label: "主色亮部" },
  { name: "--theme-color-secondary", label: "副色" },
  { name: "--theme-color-highlight", label: "高光" },
  { name: "--theme-color-accent", label: "点缀" },
] as const;

const DESIGN_SHOWCASE_READ = [
  ...DESIGN_SHOWCASE_SWATCHES.map((swatch) => swatch.name),
  ...DESIGN_SHOWCASE_TOKENS,
];

const DESIGN_SHOWCASE_TEXT_LEVELS = [
  "hero",
  "title",
  "heading",
  "subheading",
  "lead",
  "body",
  "caption",
  "label",
] as const;

const DESIGN_SHOWCASE_TEXT_SAMPLE = "前端 Web";

const DESIGN_SHOWCASE_TAGS = ["React", "TypeScript", "Three.js", "GLSL"];

const DESIGN_SHOWCASE_PAIRS = [
  { key: "ROLE", value: "Frontend" },
  { key: "STACK", value: "React · Three.js" },
];

const DESIGN_SHOWCASE_ARTS = (
  Object.keys(DESIGN_SHOWCASE_ART_PROJECTS) as (keyof typeof DESIGN_SHOWCASE_ART_PROJECTS)[]
).map((type) => ({ type, project: DESIGN_SHOWCASE_ART_PROJECTS[type], Art: UI.Art[type] }));

const DESIGN_SHOWCASE_IMAGES = [
  { label: "已加载", src: designShowcasePhoto, alt: "演示图片" },
  { label: "加载失败", src: "missing.jpg", alt: "加载失败的演示图片" },
];

const DESIGN_SHOWCASE_CARD = {
  href: "#work",
  media: <UI.Art.Dashboard />,
  title: "作品名称",
  text: "一句话说明这个作品是什么、解决了什么问题。",
  tags: ["React", "Three.js", "GLSL"],
};

function DesignShowcaseDemo({
  name,
  api,
  children,
}: {
  name: string;
  api: string;
  children: ReactNode;
}) {
  return (
    <article className="design-showcase__demo">
      <header className="design-showcase__demo-head">
        <UI.Stack gap="xs">
          <UI.Text level="label" text={name} />
          <code className="design-showcase__code">{api}</code>
        </UI.Stack>
      </header>
      <div className="design-showcase__demo-stage">
        <UI.Stack gap="s">{children}</UI.Stack>
      </div>
    </article>
  );
}

export function DesignShowcasePage() {
  const themeSelection = Theme.useSelection();
  const { selection } = themeSelection;
  const variant = Theme.selectionVariant(selection);
  const [tokens, setTokens] = useState<DesignShowcaseTokenValues>({});
  const groupInfo = DESIGN_SHOWCASE_GROUPS[selection.group];
  const variantInfo = DESIGN_SHOWCASE_VARIANTS[variant];
  const { reducedMotion } = Stage.useQuality();
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setTokens(
      Object.fromEntries(
        DESIGN_SHOWCASE_READ.map((name) => [name, style.getPropertyValue(name).trim()]),
      ),
    );
  }, [selection]);

  return (
    <>
      <Theme.Scene selection={selection} />
      <Layout.DevHeader theme={themeSelection} />
      <div className="design-showcase">
        <UI.Main>
          <UI.Stack gap="l">
            <UI.Section index="01" label="THEME">
              <UI.Text
                level="hero"
                text={Theme.GROUPS[selection.group].label.replace(" · ", "\n")}
              />
              <UI.Text level="lead" text={groupInfo.tagline} />
              <UI.Quote source={Theme.VARIANT_LABELS[variant]} text={variantInfo.summary} />
              <UI.Split
                aside={
                  <UI.Panel tag="WHY THIS THEME">
                    <UI.Text level="body" text={groupInfo.motive} />
                  </UI.Panel>
                }
              >
                <UI.Stack>
                  <UI.Text level="label" text="灵感来源" />
                  {[...groupInfo.inspirations, ...variantInfo.inspirations].map((item) => (
                    <UI.Quote key={item.source} source={item.source} text={item.note} />
                  ))}
                </UI.Stack>
              </UI.Split>
            </UI.Section>

            <UI.Section index="02" label="INTERACTION">
              <UI.Text level="lead" text="直接在背景上试。" />
              <UI.Pairs
                items={variantInfo.interactions.map((item) => ({
                  key: item.gesture,
                  value: item.effect,
                }))}
              />
            </UI.Section>

            <UI.Section index="03" label="TOKENS">
              <UI.Text level="label" text="色彩" />
              <UI.Grid columns={4}>
                {DESIGN_SHOWCASE_SWATCHES.map(({ name, label }) => (
                  <figure key={name} className="design-showcase__figure">
                    <UI.Stack gap="s">
                      <span
                        className="design-showcase__swatch-chip"
                        style={{ background: `var(${name})` }}
                      />
                      <figcaption>
                        <UI.Stack gap="xs">
                          <UI.Text level="caption" text={label} />
                          <code className="design-showcase__code">{name}</code>
                          <UI.Text level="caption" text={tokens[name] ?? ""} />
                        </UI.Stack>
                      </figcaption>
                    </UI.Stack>
                  </figure>
                ))}
              </UI.Grid>

              <UI.Text level="label" text="文字字阶" />
              <UI.Stack gap="m">
                {DESIGN_SHOWCASE_TEXT_LEVELS.map((level) => (
                  <UI.Stack key={level} gap="xs">
                    <code className="design-showcase__code">{`level="${level}"`}</code>
                    <UI.Text level={level} text={DESIGN_SHOWCASE_TEXT_SAMPLE} />
                  </UI.Stack>
                ))}
              </UI.Stack>

              <UI.Text level="label" text="令牌" />
              <UI.Pairs
                items={DESIGN_SHOWCASE_TOKENS.map((name) => ({
                  key: name,
                  value: tokens[name] ?? "",
                }))}
                vertical
              />
            </UI.Section>

            <UI.Section index="04" label="COMPONENTS">
              <UI.Grid>
                <DesignShowcaseDemo name="链接" api="<UI.Link href text active />">
                  <UI.Link href="#work" text="SELECTED WORK" />
                  <UI.Link href="#work" text="CURRENT" active />
                  <UI.Link href={import.meta.env.PUBLIC_GITHUB_URL} text="GITHUB" />
                </DesignShowcaseDemo>
                <DesignShowcaseDemo
                  name="按钮"
                  api='<UI.Button variant="solid | outline" size="medium | large | icon" disabled />'
                >
                  <UI.Stack direction="row" gap="s">
                    <UI.Button text="主操作" />
                    <UI.Button variant="outline" text="次操作" />
                    <UI.Button text="禁用" disabled />
                    <UI.Button variant="outline" size="icon" text="→" />
                  </UI.Stack>
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="标签组" api="<UI.Tags items />">
                  <UI.Tags items={DESIGN_SHOWCASE_TAGS} />
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="面板" api="<UI.Panel tag>…</UI.Panel>">
                  <UI.Panel tag="UI">
                    <UI.Text level="body" text="面板里的内容要能被认真读。" />
                  </UI.Panel>
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="引用块" api="<UI.Quote source text />">
                  <UI.Quote source="出处" text="引用的一段话放在这里。" />
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="键值对" api="<UI.Pairs items />">
                  <UI.Pairs items={DESIGN_SHOWCASE_PAIRS} />
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="图片" api="<UI.Image src alt ratio fit priority />">
                  <UI.Grid columns={2}>
                    {DESIGN_SHOWCASE_IMAGES.map((image) => (
                      <figure key={image.label} className="design-showcase__figure">
                        <UI.Stack gap="xs">
                          <UI.Image src={image.src} alt={image.alt} ratio="16 / 10" />
                          <figcaption>
                            <UI.Text level="caption" text={image.label} />
                          </figcaption>
                        </UI.Stack>
                      </figure>
                    ))}
                  </UI.Grid>
                </DesignShowcaseDemo>
                <DesignShowcaseDemo name="卡片" api="<UI.Card href media title text tags />">
                  <UI.Card {...DESIGN_SHOWCASE_CARD} />
                </DesignShowcaseDemo>
              </UI.Grid>
              <DesignShowcaseDemo name="阶段条" api="<UI.Stage year title text />">
                <UI.Stage year="2023" title="阶段名称" text="这一阶段做了什么，一句话。" />
              </DesignShowcaseDemo>
              {selection.group === "dmc" && (
                <DesignShowcaseDemo name="Style 评价表 · 鬼泣专属" api="Dmc.Common.StyleMeter">
                  <div className="design-showcase__meter">
                    <Dmc.Common.StyleMeter reducedMotion={reducedMotion} />
                  </div>
                </DesignShowcaseDemo>
              )}

              <UI.Stack gap="xs">
                <UI.Text level="label" text="作品图" />
                <code className="design-showcase__code">
                  {`<UI.Art.UIPackage /> 等 ${DESIGN_SHOWCASE_ARTS.length} 种`}
                </code>
              </UI.Stack>
              <UI.Grid columns={4}>
                {DESIGN_SHOWCASE_ARTS.map(({ type, project, Art }) => (
                  <figure key={type} className="design-showcase__figure">
                    <UI.Stack gap="xs">
                      <span className="design-showcase__art-frame">
                        <Art />
                      </span>
                      <figcaption>
                        <UI.Stack direction="row" gap="s">
                          <code className="design-showcase__code">{type}</code>
                          <UI.Text level="caption" text={project} />
                        </UI.Stack>
                      </figcaption>
                    </UI.Stack>
                  </figure>
                ))}
              </UI.Grid>
            </UI.Section>
          </UI.Stack>
        </UI.Main>
      </div>
    </>
  );
}
