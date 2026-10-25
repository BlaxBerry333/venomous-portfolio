import * as Theme from "@/ui/themes";

export function Background() {
  const { selection } = Theme.useSelection();
  return <Theme.Scene selection={selection} />;
}
