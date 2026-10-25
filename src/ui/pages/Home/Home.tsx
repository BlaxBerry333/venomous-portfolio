import * as I18n from "@/i18n";
import * as Layout from "@/ui/layout";
import * as UI from "@/ui/shared/kit";
import * as Theme from "@/ui/themes";

const HOME_SCREENS = ["arrival", "about", "works", "journey", "contact"];

function Arrival({ dmc, hint }: { dmc: boolean; hint: string }) {
  if (dmc) {
    return (
      <UI.Section id="arrival" full centered>
        <UI.Stack gap="m" align="center">
          <UI.Text level="hero" text={I18n.Data.CLAIM} accent />
          <UI.Text level="label" text={hint} />
        </UI.Stack>
      </UI.Section>
    );
  }
  return (
    <UI.Screen id="arrival">
      <UI.Text level="hero" text={I18n.Data.CLAIM} accent />
      <UI.Text level="label" text={hint} />
    </UI.Screen>
  );
}

export function Home({ locale }: { locale: I18n.Locale }) {
  const theme = Theme.useSelection();
  const dmc = theme.selection.group === "dmc";
  const messages = I18n.MESSAGES[locale];
  const texts = messages.UI.home;
  const works = I18n.Data.localizedWorks(locale).map((work) => ({
    id: work.id,
    href: I18n.route(locale, "work", work.id),
    title: work.title,
    subtitle: work.subtitle,
    art: work.arts[0],
    image: work.images?.[0]?.src,
    period: work.years ?? work.period,
    tags: work.personal ? [messages.UI.work.personal] : undefined,
  }));
  return (
    <Layout.Page theme={theme} locale={locale} screens={HOME_SCREENS}>
      <Arrival dmc={dmc} hint={messages.PROFILE.hints[Theme.selectionVariant(theme.selection)]} />

      <UI.Section id="about" label={texts.about.label} title={texts.about.title}>
        <UI.Text level="lead" text={messages.PROFILE.about} />
      </UI.Section>

      <UI.Section id="works" label={texts.works.label} title={texts.works.title}>
        <UI.Works items={works} limit={4} more={texts.works.more} stagger={dmc} />
      </UI.Section>

      <UI.Section id="journey" full label={texts.journey.label} title={texts.journey.title}>
        <UI.Timeline items={I18n.Data.localizedJourney(locale)} />
      </UI.Section>

      <UI.Section id="contact" full centered>
        <UI.Text level="title" text={messages.PROFILE.closing} />
        <UI.Quote text={I18n.Data.CLOSING_QUOTE} />
        <UI.Stack direction="row" gap="s">
          {I18n.Data.localizedContacts(locale).map((item, i) => (
            <UI.Button
              key={item.text}
              variant={i === 0 ? "solid" : "outline"}
              size="large"
              text={item.text}
              href={item.href}
            />
          ))}
        </UI.Stack>
      </UI.Section>
    </Layout.Page>
  );
}
