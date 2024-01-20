
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose } from "redux";
import { legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";
import reducers from "reducers";

import App from "App";

// React Context Provider
import { MaterialUIControllerProvider } from "context";

const store = createStore(reducers, compose(applyMiddleware(thunk)));
const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>
);
