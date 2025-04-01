import { ContentHeader, DataUser } from "../../index";
import { MouseEventHandler } from "react";

// Definir el tipo de props para Header
interface StateConfig {
  state: boolean;
  setState: MouseEventHandler<HTMLDivElement>;
}

interface HeaderProps {
  stateConfig: StateConfig;
}

export const Header = ({ stateConfig }: HeaderProps) => {
  return (
    <ContentHeader>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DataUser stateConfig={stateConfig} />
      </div>
    </ContentHeader>
  );
}
