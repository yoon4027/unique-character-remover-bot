import { OWNERS } from "#root/config";
import {
  AliasPiece,
  ApplicationCommandRegistry,
  Command,
  CommandJSON,
  CommandOptions,
  CommandOptionsRunType,
  CommandOptionsRunTypeEnum,
} from "@sapphire/framework";
import { envParseString } from "@skyra/env-utilities";
import type { CacheType, CommandInteraction } from "discord.js";
import { sep } from "path";

export class UniqueCommand extends Command {
  public constructor(
    context: UniqueCommand.Context,
    options: UniqueCommand.Options
  ) {
    super(context, {
      runIn: [CommandOptionsRunTypeEnum.GuildAny],
      generateDashLessAliases: true,
      cooldownFilteredUsers: OWNERS,
      chatInputCommand: {
        guildIds:
          process.env.NODE_ENV === "development"
            ? [envParseString("TEST_GUILD")]
            : undefined,
        register: true,
        ...options.chatInputCommand,
      },
      ...options,
    });

    console.log(options.chatInputCommand);
  }

  public get category(): string {
    return this.location.full.split(sep).reverse()[1] ?? "General";
  }
}

export declare namespace UniqueCommand {
  type Options = CommandOptions;
  type JSON = CommandJSON;
  type Context = AliasPiece.Context;
  type RunInTypes = CommandOptionsRunType;
  type ChatInputInteraction<Cached extends CacheType = CacheType> =
    CommandInteraction<Cached>;
  type Registry = ApplicationCommandRegistry;
}
