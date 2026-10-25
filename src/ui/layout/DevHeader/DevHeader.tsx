import { DEV_ROUTES } from "@/dev/routes";
import * as I18n from "@/i18n";
import * as UI from "@/ui/shared/kit";
import type * as Theme from "@/ui/themes";
import { Frame } from "../Frame/Frame";
import { ThemeSwitch } from "../Page/ThemeSwitch";

const DEV_HEADER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const DEV_HEADER_LINKS = [
  ...DEV_ROUTES.map(({ pattern, label }) => ({
    id: label,
    text: label,
    href: `${DEV_HEADER_BASE}${pattern}`,
  })),
  { id: "HOME", text: "HOME", href: I18n.route(I18n.DEFAULT_LOCALE) },
];

export function DevHeader({ theme }: { theme: ReturnType<typeof Theme.useSelection> }) {
  const current = window.location.pathname.replace(/\/$/, "");
  const active = DEV_HEADER_LINKS.find((link) => link.href.replace(/\/$/, "") === current);
  return (
    <Frame
      screens={[]}
      theme={<ThemeSwitch {...theme} label="THEME" />}
      locale={<UI.Choice items={DEV_HEADER_LINKS} value={active?.id ?? ""} />}
    />
  );
}
