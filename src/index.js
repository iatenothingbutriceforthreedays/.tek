import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePageOld";
import { lang, messages } from "./utils/i18n";
import "./assets/stylesheets/globals.scss";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import { StripeProvider } from "react-stripe-elements";
import { check_webp_features } from "./utils/compat";

check_webp_features();

registerTelemetry("/home", "Hubs Home Page");

const store = new Store();
window.APP = { store };

function Root() {
  return (
    <IntlProvider locale={lang} messages={messages}>
      <AuthContextProvider store={store}>
        <StripeProvider apiKey="pk_live_51Gyz7NBvCtr0PkoP4zj8iAO4XStn8hW2EK1OtZvE7VPWSeg8yszmXcmvSGz1sL58BECkTI1ORq78aW7yHpGPGw4900OvDxhZ3Z">
          <HomePage />
        </StripeProvider>
      </AuthContextProvider>
    </IntlProvider>
  );
}

setTimeout(() => {
ReactDOM.render(<Root />, document.getElementById("home-root"));
}, 50);