import { StageDebugProbe } from "@/dev/debug/StageDebugProbe";
import * as Layout from "@/ui/layout";
import * as Shared from "@/ui/shared/components";
import * as UI from "@/ui/shared/kit";
import * as Stage from "@/ui/shared/stage";
import * as Theme from "@/ui/themes";
import "@/ui/themes/tokens.scss";
import { useMemo, useRef, useState } from "react";
import "./StageDebugPage.scss";

const STAGE_DEBUG_TIERS = Array.from({ length: Stage.TIER_MAX + 1 }, (_, i) => i);

export function StageDebugPage() {
  const theme = Theme.useSelection();
  const hud = useRef<HTMLDivElement>(null);
  const [forcedTier, setForcedTier] = useState<number | null>(null);
  const [, refresh] = useState(0);
  const storedTier = Stage.tierRead();
  const debug = useMemo<Stage.DebugOptions>(
    () => ({ forcedTier, probe: <StageDebugProbe target={hud} /> }),
    [forcedTier],
  );

  const forget = () => {
    Stage.tierForget();
    refresh((n) => n + 1);
  };

  return (
    <Stage.DebugContext.Provider value={debug}>
      <Theme.Scene selection={theme.selection} />
      <Layout.DevHeader theme={theme} />
      <Shared.ThemeSkeleton />
      <div className="stage-debug">
        <UI.Stack gap="xs" align="end">
          <div ref={hud} className="stage-debug__hud" />
          <UI.Stack direction="row" gap="xs">
            <button
              type="button"
              className={
                forcedTier === null
                  ? "stage-debug__button stage-debug__button--active"
                  : "stage-debug__button"
              }
              onClick={() => setForcedTier(null)}
            >
              AUTO
            </button>
            {STAGE_DEBUG_TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                className={
                  forcedTier === tier
                    ? "stage-debug__button stage-debug__button--active"
                    : "stage-debug__button"
                }
                onClick={() => setForcedTier(tier)}
              >
                TIER {tier}
              </button>
            ))}
            <button type="button" className="stage-debug__button" onClick={forget}>
              FORGET ({storedTier})
            </button>
          </UI.Stack>
        </UI.Stack>
      </div>
    </Stage.DebugContext.Provider>
  );
}
