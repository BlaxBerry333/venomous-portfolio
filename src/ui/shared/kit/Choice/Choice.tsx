import { useEffect, useRef, useState, type ReactNode } from "react";
import { linkPrefetch } from "../Link/Link";
import { Panel } from "../Panel/Panel";
import { Text } from "../Text/Text";
import "./Choice.scss";

interface ChoiceItem {
  id: string;
  text: string;
  href?: string;
  group?: string;
  icon?: ReactNode;
}

interface ChoiceProps {
  items: readonly ChoiceItem[];
  value: string;
  label?: string;
  collapsed?: boolean;
  onSelect?: (id: string) => void;
}

function ChoiceEntry({
  item,
  active,
  onPick,
}: {
  item: ChoiceItem;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const className = active
    ? "ui-choice__item ui-choice__item--active ui-link ui-link--active"
    : "ui-choice__item ui-link";
  const body = (
    <>
      {item.icon && <span className="ui-choice__icon">{item.icon}</span>}
      {item.text}
    </>
  );
  return item.href ? (
    <a
      className={className}
      href={item.href}
      draggable={false}
      onClick={() => onPick(item.id)}
      onPointerEnter={linkPrefetch(item.href)}
    >
      {body}
    </a>
  ) : (
    <button type="button" className={className} onClick={() => onPick(item.id)}>
      {body}
    </button>
  );
}

function choiceGroups(items: readonly ChoiceItem[]): [string, ChoiceItem[]][] {
  const groups = new Map<string, ChoiceItem[]>();
  for (const item of items) {
    const key = item.group ?? "";
    const list = groups.get(key);
    if (list) list.push(item);
    else groups.set(key, [item]);
  }
  return [...groups];
}

export function Choice({ items, value, label, collapsed = false, onSelect }: ChoiceProps) {
  const [opened, setOpened] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!opened) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpened(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpened(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [opened]);

  const pick = (id: string) => {
    setOpened(false);
    onSelect?.(id);
  };
  const current = items.find((item) => item.id === value);

  if (!collapsed) {
    return (
      <div className="ui-choice">
        {label && <Text level="label" text={label} />}
        {items.map((item) => (
          <ChoiceEntry key={item.id} item={item} active={item.id === value} onPick={pick} />
        ))}
      </div>
    );
  }
  return (
    <div ref={root} className={opened ? "ui-choice ui-choice--open" : "ui-choice"}>
      {label && <Text level="label" text={label} />}
      <button
        type="button"
        className="ui-choice__item ui-choice__item--active ui-link ui-link--active"
        aria-expanded={opened}
        onClick={() => setOpened(!opened)}
      >
        {current?.text}
      </button>
      {opened && (
        <div className="ui-choice__menu">
          <Panel compact>
            <div className="ui-choice__groups">
              {choiceGroups(items).map(([group, list]) => (
                <div key={group} className="ui-choice__group">
                  {group && <Text level="label" text={group} />}
                  {list.map((item) => (
                    <ChoiceEntry
                      key={item.id}
                      item={item}
                      active={item.id === value}
                      onPick={pick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
