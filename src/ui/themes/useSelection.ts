import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { GROUP_IDS, isGroupId, isVariantOf, type GroupId, type VariantId } from "./groups";

export interface Selection {
  group: GroupId;
  variants: { [G in GroupId]: VariantId<G> };
}

export const SELECTION_STORAGE_KEY = "portfolio-theme";

export const SELECTION_DEFAULT_GROUP: GroupId = "warhammer";

export const SELECTION_DEFAULT: Selection["variants"] = {
  warhammer: "tzeentch",
  dmc: "vergil",
};

export function selectionRead(): Selection {
  const selection: Selection = {
    group: SELECTION_DEFAULT_GROUP,
    variants: { ...SELECTION_DEFAULT },
  };
  try {
    const raw = window.localStorage.getItem(SELECTION_STORAGE_KEY);
    if (raw === null) return selection;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return selection;
    const { group, variants } = parsed as { group?: unknown; variants?: Record<string, unknown> };
    const stored = typeof variants === "object" && variants !== null ? variants : {};
    for (const id of GROUP_IDS) {
      if (isVariantOf(id, stored[id])) {
        (selection.variants as Record<GroupId, string>)[id] = stored[id];
      }
    }
    if (isGroupId(group)) selection.group = group;
    return selection;
  } catch {
    return selection;
  }
}

const SELECTION_EVENT = "theme-selection";

function selectionWrite(selection: Selection): void {
  try {
    window.localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selection));
  } catch {
    return;
  }
}

export function selectionVariant(selection: Selection): VariantId {
  return selection.variants[selection.group];
}

function selectionTransition(update: () => void): void {
  if (
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

export function useSelection() {
  const [selection, setSelection] = useState<Selection>(selectionRead);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = selection.group;
    root.dataset.themeVariant = selectionVariant(selection);
    selectionWrite(selection);
    window.dispatchEvent(new CustomEvent<Selection>(SELECTION_EVENT, { detail: selection }));
  }, [selection]);

  useEffect(() => {
    const sync = (event: Event) => {
      const next = (event as CustomEvent<Selection>).detail;
      setSelection((prev) =>
        prev.group === next.group &&
        GROUP_IDS.every((group) => prev.variants[group] === next.variants[group])
          ? prev
          : next,
      );
    };
    window.addEventListener(SELECTION_EVENT, sync);
    return () => window.removeEventListener(SELECTION_EVENT, sync);
  }, []);

  const selectGroup = useCallback((group: GroupId) => {
    selectionTransition(() =>
      setSelection((prev) =>
        prev.group === group && prev.variants[group] === SELECTION_DEFAULT[group]
          ? prev
          : { group, variants: { ...prev.variants, [group]: SELECTION_DEFAULT[group] } },
      ),
    );
  }, []);

  const selectVariant = useCallback(<G extends GroupId>(group: G, variant: VariantId<G>) => {
    selectionTransition(() =>
      setSelection((prev) =>
        prev.group === group && prev.variants[group] === variant
          ? prev
          : { group, variants: { ...prev.variants, [group]: variant } },
      ),
    );
  }, []);

  return { selection, selectGroup, selectVariant };
}
