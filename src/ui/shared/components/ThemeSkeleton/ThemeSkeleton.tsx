import * as UI from "@/ui/shared/kit";
import "./ThemeSkeleton.scss";

interface ThemeSkeletonBarProps {
  width: string;
  size?: "title" | "lead" | "text" | "tag";
}

const THEME_SKELETON_JOURNEY = ["2019", "2021", "2023", "NOW"];
const THEME_SKELETON_WORK = ["UI", "BFF", "DATA"];

function ThemeSkeletonBar({ width, size = "text" }: ThemeSkeletonBarProps) {
  return <span className={`theme-skeleton__bar theme-skeleton__bar--${size}`} style={{ width }} />;
}

export function ThemeSkeleton() {
  return (
    <div className="theme-skeleton">
      <main>
        <section className="theme-skeleton__section theme-skeleton__section--arrival">
          <UI.Text level="label" text="01 · ARRIVAL" />
          <div className="theme-skeleton__title">
            <ThemeSkeletonBar width="68%" size="title" />
            <ThemeSkeletonBar width="44%" size="title" />
          </div>
          <div className="theme-skeleton__lead">
            <ThemeSkeletonBar width="52%" size="lead" />
            <ThemeSkeletonBar width="38%" size="lead" />
          </div>
          <UI.Link href="#work" text="SELECTED WORK" />
        </section>

        <section className="theme-skeleton__section theme-skeleton__section--journey">
          <UI.Text level="label" text="02 · JOURNEY" />
          <ol className="theme-skeleton__journey">
            {THEME_SKELETON_JOURNEY.map((year, i) => (
              <li key={year} className="theme-skeleton__stage">
                <span className="theme-skeleton__year">{year}</span>
                <div className="theme-skeleton__stage-body">
                  <ThemeSkeletonBar width={`${56 - i * 6}%`} size="lead" />
                  <ThemeSkeletonBar width="88%" />
                  <ThemeSkeletonBar width="72%" />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="theme-skeleton__section theme-skeleton__section--work">
          <UI.Text level="label" text="03 · SELECTED WORK" />
          <div className="theme-skeleton__grid">
            {THEME_SKELETON_WORK.map((tag) => (
              <UI.Panel key={tag} tag={tag}>
                <ThemeSkeletonBar width="70%" size="lead" />
                <ThemeSkeletonBar width="92%" />
                <ThemeSkeletonBar width="84%" />
                <ThemeSkeletonBar width="60%" />
                <UI.Link href="#work" text="CASE" />
              </UI.Panel>
            ))}
          </div>
        </section>

        <section className="theme-skeleton__section theme-skeleton__section--profile">
          <UI.Text level="label" text="04 · PROFILE" />
          <div className="theme-skeleton__columns">
            <div className="theme-skeleton__bio">
              <ThemeSkeletonBar width="48%" size="title" />
              <ThemeSkeletonBar width="94%" />
              <ThemeSkeletonBar width="90%" />
              <ThemeSkeletonBar width="76%" />
              <ThemeSkeletonBar width="82%" />
            </div>
            <UI.Panel tag="WHY THIS THEME">
              <ThemeSkeletonBar width="92%" />
              <ThemeSkeletonBar width="86%" />
              <ThemeSkeletonBar width="64%" />
            </UI.Panel>
          </div>
        </section>
      </main>

      <footer className="theme-skeleton__footer">
        <ThemeSkeletonBar width="160px" size="tag" />
        <ThemeSkeletonBar width="90px" size="tag" />
      </footer>
    </div>
  );
}
