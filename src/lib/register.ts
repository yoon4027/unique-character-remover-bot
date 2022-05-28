/** References from: https://github.com/skyra-project/skyra/blob/main/src/lib/setup/index.ts */

import "#root/config";
import "@sapphire/plugin-api/register";
import "@sapphire/plugin-editable-commands/register";
import "@sapphire/plugin-i18next/register";
import "@sapphire/plugin-logger/register";
import { inspect } from "node:util";

inspect.defaultOptions.depth = 1;
