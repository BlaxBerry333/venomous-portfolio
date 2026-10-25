import { Text } from "../Text/Text";
import "./Stage.scss";

interface StageProps {
  year: string;
  title: string;
  text?: string;
  company?: string;
  companyLang?: string;
}

export function Stage({ year, title, text, company, companyLang }: StageProps) {
  return (
    <div className="ui-stage">
      <Text level="numeral" text={year} />
      <div className="ui-stage__body">
        {company && (
          <div className="ui-stage__company">
            <Text level="label" lang={companyLang} text={company} />
          </div>
        )}
        <Text level="lead" text={title} />
        {text && <Text level="caption" text={text} />}
      </div>
    </div>
  );
}
