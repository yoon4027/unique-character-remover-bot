process.env.NODE_ENV ??= "development";
import { LogLevel, SapphireClientOptions } from "@sapphire/framework";
import type { ServerOptions } from "@sapphire/plugin-api";
import {
  envParseArray,
  envParseInteger,
  envParseString,
  setup,
} from "@skyra/env-utilities";
import { ClientOptions, Intents, Options, Sweepers } from "discord.js";
import { join } from "path";

setup();

export const TOKEN = envParseString("TOKEN");
export const PREFIXES = envParseArray("PREFIXES");
export const OWNERS = envParseArray("OWNERS", []);
export const SENTRY_URL = envParseString("SENTRY_URL");
export const REDIS_URL = envParseString("REDIS_URL");

console.log(PREFIXES);

export const CLIENT_OPTIONS: SapphireClientOptions & ClientOptions = {
  baseUserDirectory: join(__dirname),
  api: parseApi(),
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultPrefix: PREFIXES,
  logger: {
    level: LogLevel.Debug,
  },
  loadDefaultErrorListeners: false,
  loadMessageCommandListeners: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ["GUILD_MEMBER"],
  makeCache: Options.cacheWithLimits({
    MessageManager: 100,
    StageInstanceManager: 10,
    ThreadManager: {
      sweepInterval: 3600,
      sweepFilter: Sweepers.archivedThreadSweepFilter(),
    },
    VoiceStateManager: 10,
  }),
  sweepers: {
    messages: {
      interval: 180000,
      lifetime: 600000,
    },
    threads: {
      interval: 6e4,
      lifetime: 300000,
    },
  },
};

function parseApi(): ServerOptions {
  return {
    prefix: envParseString("API_PREFIX", "/"),
    origin: envParseString("API_ORIGIN"),
    listenOptions: { port: envParseInteger("API_PORT") },
  };
}
