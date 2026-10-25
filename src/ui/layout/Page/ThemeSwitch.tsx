import * as UI from "@/ui/shared/kit";
import * as Theme from "@/ui/themes";
import "./ThemeSwitch.scss";

type ThemeSwitchProps = ReturnType<typeof Theme.useSelection> & {
  label: string;
};

function themeSwitchText(label: string): string {
  return label.split(" · ")[0];
}

const THEME_SWITCH_ITEMS = Theme.GROUP_IDS.flatMap((group) =>
  Theme.GROUPS[group].variants.map((id) => ({
    id,
    text: themeSwitchText(Theme.VARIANT_LABELS[id]),
    group: themeSwitchText(Theme.GROUPS[group].label),
    icon: <span className="theme-switch__swatch" data-theme={group} data-theme-variant={id} />,
  })),
);

export function ThemeSwitch({ selection, selectVariant, label }: ThemeSwitchProps) {
  return (
    <UI.Choice
      label={label}
      items={THEME_SWITCH_ITEMS}
      value={Theme.selectionVariant(selection)}
      onSelect={(id) => {
        for (const group of Theme.GROUP_IDS) {
          if (Theme.isVariantOf(group, id)) selectVariant(group, id);
        }
      }}
      collapsed
    />
  );
}
