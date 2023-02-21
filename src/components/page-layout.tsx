import React from "react";
import { NavBar } from "./nav/nav-bar";
import { Footer } from "./nav/footer";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="page-layout">

      <NavBar />
      <div className="page-layout__content">{children}</div>
      <Footer />
    </div>
  );
};