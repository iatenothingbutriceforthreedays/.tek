import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePage";
import { lang, messages } from "./utils/i18n";
import "./assets/stylesheets/globals.scss";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import {StripeProvider} from 'react-stripe-elements';

registerTelemetry("/home", "Hubs Home Page");

const store = new Store();
window.APP = { store };

function Root() {
  return (
    <IntlProvider locale={lang} messages={messages}>
      <AuthContextProvider store={store}>
      <StripeProvider apiKey="pk_test_51Gyz7NBvCtr0PkoPQLGAdHP6qLtechXlKcTqgjLfcNgnCHmJuwYvG0IeP5yH4EUZJB5hzm5t3jsPWQKFn947Rgq100APsKrCXg">

        <HomePage />
    </StripeProvider>
      </AuthContextProvider>
    </IntlProvider>
  );
}


ReactDOM.render(<Root />, document.getElementById("home-root"));
