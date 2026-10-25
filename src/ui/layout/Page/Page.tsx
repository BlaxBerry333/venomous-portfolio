import * as I18n from "@/i18n";
import * as UI from "@/ui/shared/kit";
import * as Theme from "@/ui/themes";
import "@/ui/themes/tokens.scss";
import { useEffect, type ReactNode } from "react";
import { Frame } from "../Frame/Frame";
import "./Page.scss";
import { ThemeSwitch } from "./ThemeSwitch";

interface PageProps {
  theme: ReturnType<typeof Theme.useSelection>;
  locale: I18n.Locale;
  path?: readonly string[];
  back?: ReactNode;
  screens: readonly string[];
  children: ReactNode;
}

const PAGE_LOCALES = I18n.LOCALES.map((id) => ({
  id,
  text: I18n.MESSAGES[id].UI.label,
}));

export function Page({ theme, locale, path = [], back, screens, children }: PageProps) {
  useEffect(() => {
    if (window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    }
  }, []);

  return (
    <div className="layout-page">
      <Frame
        screens={screens}
        back={back}
        theme={<ThemeSwitch {...theme} label={I18n.MESSAGES[locale].UI.theme} />}
        locale={
          PAGE_LOCALES.length > 1 && (
            <UI.Choice
              items={PAGE_LOCALES.map((item) => ({
                ...item,
                href: I18n.route(item.id, ...path),
              }))}
              value={locale}
            />
          )
        }
      />
      <UI.Main>{children}</UI.Main>
    </div>
  );
}
