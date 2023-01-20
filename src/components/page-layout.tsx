import React from "react";


interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="page-layout">

      <div className="page-layout__content">{children}</div>

    </div>
  );
};