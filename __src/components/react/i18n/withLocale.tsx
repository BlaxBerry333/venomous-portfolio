import type { Locale } from "@/types";
import type { ComponentType, ReactElement } from "react";
import { LocaleProvider } from "./LocaleContext";

/**
 * Wrap a React component so its root injects a LocaleProvider.
 * Use for entry-level islands so all descendants can `useLocale()`.
 *
 * locale 既作为 Provider 注入给后代 useLocale 用，
 * 也透传给 Inner — 让 dispatch 组件不必 useLocale() 拿就能转给主题子件。
 *
 * Usage:
 *   const Foo = withLocale(BareFoo);
 *   <Foo locale="en" {...rest} />
 */
export function withLocale<P>(
  Inner: ComponentType<P>,
): ComponentType<Omit<P, "locale"> & { locale: Locale }> {
  function LocaleAware(props: Omit<P, "locale"> & { locale: Locale }): ReactElement {
    const { locale } = props;
    const innerProps = props as unknown as P & JSX.IntrinsicAttributes;
    return (
      <LocaleProvider locale={locale}>
        <Inner {...innerProps} />
      </LocaleProvider>
    );
  }
  LocaleAware.displayName = `withLocale(${Inner.displayName ?? Inner.name ?? "Anonymous"})`;
  return LocaleAware;
}
