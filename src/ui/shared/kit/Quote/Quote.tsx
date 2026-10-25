import { Text } from "../Text/Text";
import "./Quote.scss";

export function Quote({ source, text }: { source?: string; text: string }) {
  return (
    <blockquote className="ui-quote">
      {source && <cite className="ui-quote__source">{source}</cite>}
      <Text level="body" text={text} />
    </blockquote>
  );
}
