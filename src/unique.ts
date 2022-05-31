import "#lib/register";
import { UniqueClient } from "#lib/UniqueClient";
import { container } from "@sapphire/pieces";
import * as Sentry from "@sentry/node";
import { SENTRY_URL } from "./config";

const client = new UniqueClient();

Sentry.init({
  dsn: SENTRY_URL,
  integrations: [
    new Sentry.Integrations.Modules(),
    new Sentry.Integrations.FunctionToString(),
    new Sentry.Integrations.LinkedErrors(),
    new Sentry.Integrations.Console(),
    new Sentry.Integrations.Http({ breadcrumbs: true, tracing: true }),
  ],
});

client
  .on("error", (err) => container.logger.error(err))
  .on("debug", (debug) => container.logger.debug(debug));

client.login();
