import "./Tags.scss";

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="ui-tags">
      {items.map((item) => (
        <li key={item} className="ui-tags__item">
          {item}
        </li>
      ))}
    </ul>
  );
}
