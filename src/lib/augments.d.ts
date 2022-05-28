import type { PrismaClient } from "@prisma/client";
import type { ArrayString, IntegerString } from "@skyra/env-utilities";
import type { UserResolvable } from "discord.js";
import type { SettingsProvider } from "./db";

declare module "@sapphire/pieces" {
  interface Container {
    prisma: PrismaClient;
  }
}

declare module "@sapphire/framework" {
  interface SapphireClient {
    readonly settings: SettingsProvider;
    readonly deletedMessages: Set<string>;
    isOwner(user: UserResolvable): boolean;
  }
}

declare module "@skyra/env-utilities" {
  interface Env {
    DATABASE_URL: string;
    TOKEN: string;
    OWNERS: ArrayString;
    IP: string;
    PREFIXES: ArrayString;
    SENTRY_URL: string;
    REDIS_URL: string;
    DBL: string;
    API_PREFIX: string;
    API_PORT: IntegerString;
    API_ORIGIN: string;
    TEST_GUILD: string;
    VOTERS_CHANNEL: string;
  }
}
declare module "@sapphire/framework" {
  export const enum Identifiers {
    OwnerOnly = "ownerOnly",
  }
}

interface IMessageIds {
  time: number;
  messageId: string;
}
