import { Text } from "../Text/Text";
import "./Step.scss";

export function Step({ index, title, text }: { index: string; title: string; text: string }) {
  return (
    <div className="ui-step">
      <Text level="numeral" text={index} />
      <div className="ui-step__body">
        <Text level="subheading" text={title} />
        <Text level="body" text={text} />
      </div>
    </div>
  );
}
