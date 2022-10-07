import React from "react";
import QueryContextProvider from "./contexts/query-context";

import { HomePage } from "./pages/home-page/home-page";

import './style/App.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Header } from "./components/header/header";
import { GraphContextProvider } from "./contexts/graph-context";

window.addEventListener('error', function(e){});

export const App = () => {
  return (
    <div className="App">      
        <QueryContextProvider>
          <GraphContextProvider>
            <Header/>
            <HomePage/>
          </GraphContextProvider>
        </QueryContextProvider>
    </div>
  );
}