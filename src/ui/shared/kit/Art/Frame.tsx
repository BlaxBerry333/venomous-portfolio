import type { ReactNode } from "react";
import "./Art.scss";

export function Frame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg
      className="ui-art"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.78" cy="0.18" r="0.85">
          <stop className="ui-art__stop-primary" offset="0" stopOpacity="0.25" />
          <stop className="ui-art__stop-primary" offset="1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-primary`} x1="0" y1="0" x2="0" y2="1">
          <stop className="ui-art__stop-primary" offset="0" stopOpacity="0.75" />
          <stop className="ui-art__stop-primary" offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-secondary`} x1="0" y1="0" x2="0" y2="1">
          <stop className="ui-art__stop-secondary" offset="0" stopOpacity="0.7" />
          <stop className="ui-art__stop-secondary" offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-tertiary`} x1="0" y1="0" x2="0" y2="1">
          <stop className="ui-art__stop-tertiary" offset="0" stopOpacity="0.6" />
          <stop className="ui-art__stop-tertiary" offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect className="ui-art__ground" width="1600" height="1000" opacity="0.7" />
      <rect width="1600" height="1000" fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  );
}
