import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { lang, messages } from "./utils/i18n";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import { About } from "./react-components/about/About";
import { CoC } from "./react-components/coc/CoC";

import "./assets/stylesheets/globals.scss";

registerTelemetry("/about", "Hubs About Page");

const store = new Store();
window.APP = { store };

function Root() {
  return (
    <IntlProvider locale={lang} messages={messages}>
      <AuthContextProvider store={store}>
        <About />
        {/* <CoC /> */}
      </AuthContextProvider>
    </IntlProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("ui-root"));
