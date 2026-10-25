import * as UI from "@/ui/shared/kit";
import { useMemo, useRef } from "react";
import "./StyleMeter.scss";
import { STYLE_RANKS, useStyle, type StyleSignal } from "./useStyle";

interface StyleMeterProps {
  reducedMotion: boolean;
  signal?: StyleSignal;
}

export function StyleMeter({ reducedMotion, signal }: StyleMeterProps) {
  const meter = useRef<HTMLDivElement>(null);
  const letter = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => ({ meter, letter, name }), []);
  const { rank, change, direction, visible, frozen } = useStyle(refs, reducedMotion, signal);
  const current = STYLE_RANKS[rank];
  const motion = reducedMotion
    ? ""
    : direction > 0
      ? " dmc-style-meter--up"
      : " dmc-style-meter--down";

  return (
    <div
      ref={meter}
      className={`dmc-style-meter dmc-style-meter--rank-${rank}${visible ? " dmc-style-meter--visible" : ""}${frozen ? " dmc-style-meter--frozen" : ""}`}
      aria-hidden="true"
    >
      <div className="dmc-style-meter__body">
        <div key={change} className={`dmc-style-meter__slam${motion}`}>
          <div ref={letter} className="dmc-style-meter__letter" data-letter={current.letter}>
            <span className="dmc-style-meter__hollow">{current.letter}</span>
            <span className="dmc-style-meter__fill">{current.letter}</span>
          </div>
          <div ref={name} className="dmc-style-meter__name">
            <div className="dmc-style-meter__words">
              {current.name.split(" ").map((word) => (
                <div key={word} className="dmc-style-meter__word">
                  <UI.Text level="subheading" text={word} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
