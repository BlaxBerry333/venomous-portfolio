import { lazy, Suspense, type ComponentType } from "react";
import type { GroupId, VariantId } from "./groups";
import { selectionVariant, type Selection } from "./useSelection";

const SCENE_LAZY: { [G in GroupId]: Record<VariantId<G>, ComponentType> } = {
  warhammer: {
    tzeentch: lazy(() => import("./warhammer/tzeentch/Scene").then((m) => ({ default: m.Scene }))),
    slaanesh: lazy(() => import("./warhammer/slaanesh/Scene").then((m) => ({ default: m.Scene }))),
  },
  dmc: {
    dante: lazy(() => import("./dmc/dante/Scene").then((m) => ({ default: m.Scene }))),
    vergil: lazy(() => import("./dmc/vergil/Scene").then((m) => ({ default: m.Scene }))),
  },
};

export function Scene({ selection }: { selection: Selection }) {
  const { group } = selection;
  const variant = selectionVariant(selection);
  const Selected = (SCENE_LAZY[group] as Record<string, ComponentType>)[variant];
  return (
    <Suspense key={`${group}/${variant}`} fallback={null}>
      <Selected />
    </Suspense>
  );
}
