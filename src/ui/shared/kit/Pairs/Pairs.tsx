import "./Pairs.scss";

interface PairsProps {
  items: readonly { key: string; value: string }[];
  vertical?: boolean;
}

export function Pairs({ items, vertical = false }: PairsProps) {
  return (
    <dl className={vertical ? "ui-pairs ui-pairs--vertical" : "ui-pairs"}>
      {items.map((item) => (
        <div key={item.key} className="ui-pairs__item">
          <dt className="ui-pairs__key">{item.key}</dt>
          <dd className="ui-pairs__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
