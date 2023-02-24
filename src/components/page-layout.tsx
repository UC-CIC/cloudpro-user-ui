import React from "react";
import { NavBar } from "./nav/nav-bar";
import { NavBarAuthed } from "./nav/nav-bar-authed";
import { Footer } from "./nav/footer";

import { useAuth } from "../hooks/useAuth";


interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  const auth = useAuth();

  return (
    <div className="page-layout">

      { auth.username === "" ?
      <NavBar /> : <NavBarAuthed />
      }
      <div className="page-layout__content">{children}</div>
      <Footer />
    </div>
  );
};