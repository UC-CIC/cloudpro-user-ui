import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { ProvideAuth } from "./hooks/useAuth";

/* import "./styles/styles.css"; */

import { ChakraProvider } from '@chakra-ui/react'

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ProvideAuth>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </ProvideAuth>
    </ChakraProvider>
  </React.StrictMode>
);