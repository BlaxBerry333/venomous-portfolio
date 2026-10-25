import { useEffect, useState, type ReactNode } from "react";
import "./Frame.scss";

interface FrameProps {
  screens: readonly string[];
  back?: ReactNode;
  theme: ReactNode;
  locale: ReactNode;
}

export function Frame({ screens, back, theme, locale }: FrameProps) {
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight / 2;
      let index = 0;
      screens.forEach((id, i) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) index = i;
      });
      setActive(index);
      setScrolled(window.scrollY > 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [screens]);

  return (
    <>
      <div className="layout-frame__scrim" />
      <div className={scrolled ? "layout-frame layout-frame--scrolled" : "layout-frame"}>
        <div className="layout-frame__row">
          <div className="layout-frame__theme">
            {back}
            {theme}
          </div>
          <div className="layout-frame__links">{locale}</div>
        </div>
        <div
          className={
            active > 0 ? "layout-frame__pager" : "layout-frame__pager layout-frame__pager--hidden"
          }
        >
          {screens.map((id, i) => (
            <span
              key={id}
              className={
                i === active ? "layout-frame__bar layout-frame__bar--active" : "layout-frame__bar"
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
