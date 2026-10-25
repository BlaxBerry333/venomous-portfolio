import * as I18n from "@/i18n";
import * as Layout from "@/ui/layout";
import * as UI from "@/ui/shared/kit";
import * as Theme from "@/ui/themes";
import { Chapter } from "./Chapter";
import { Media, workIndex } from "./Media";

export function Work({ locale, id }: { locale: I18n.Locale; id: string }) {
  const theme = Theme.useSelection();
  const dmc = theme.selection.group === "dmc";
  const texts = I18n.MESSAGES[locale].UI.work;
  const works = I18n.Data.localizedWorks(locale);
  const work = works.find((item) => item.id === id) ?? works[0];
  const related = work.related?.flatMap((relatedId) => {
    const item = works.find((candidate) => candidate.id === relatedId);
    return item
      ? [
          {
            id: item.id,
            href: I18n.route(locale, "work", item.id),
            title: item.title,
            subtitle: item.subtitle,
            art: item.arts[0],
            image: item.images?.[0]?.src,
          },
        ]
      : [];
  });
  const contribution = Boolean(work.contributions || work.stack);
  const screens = [
    "overview",
    "product",
    ...(contribution ? ["contribution"] : []),
    ...(related?.length ? ["related"] : []),
  ];
  const spec = [
    { key: texts.period, value: work.period },
    ...(work.role ? [{ key: texts.role, value: work.role }] : []),
  ];
  const actions = work.links && (
    <UI.Stack direction="row" gap="s">
      {work.links.map((link, i) => (
        <UI.Button
          key={link.href}
          variant={i === 0 ? "solid" : "outline"}
          text={link.text}
          href={link.href}
        />
      ))}
    </UI.Stack>
  );
  return (
    <Layout.Page
      theme={theme}
      locale={locale}
      path={["work", work.id]}
      back={<UI.Link href={I18n.route(locale)} text={texts.back} back />}
      screens={screens}
    >
      <UI.Section id="overview" full>
        <UI.Stack gap="m" align="start">
          <UI.Text level="label" text={work.personal ? texts.personal : texts.label} />
          <UI.Text level="hero" text={work.title} accent />
          <UI.Pairs items={spec} />
        </UI.Stack>
      </UI.Section>

      <Chapter
        id="product"
        label={texts.product.label}
        title={texts.product.title}
        text={work.summary}
        aside={actions}
      >
        <Media arts={work.images ? [] : work.arts} images={work.images} />
      </Chapter>

      {contribution && (
        <Chapter
          id="contribution"
          label={texts.contribution.label}
          title={texts.contribution.title}
          text={work.contributionSummary}
          aside={
            work.stack && (
              <UI.Stack gap="s" align="start">
                <UI.Text level="label" text={texts.stack} />
                <UI.Tags items={work.stack} />
              </UI.Stack>
            )
          }
        >
          <UI.Stack gap="l" align="start">
            {work.contributions?.map((item, i) => (
              <UI.Step key={item.title} index={workIndex(i)} title={item.title} text={item.text} />
            ))}
          </UI.Stack>
        </Chapter>
      )}

      {related && related.length > 0 && (
        <UI.Section id="related" label={texts.related.label} title={texts.related.title}>
          <UI.Works items={related} stagger={dmc} />
        </UI.Section>
      )}
    </Layout.Page>
  );
}
