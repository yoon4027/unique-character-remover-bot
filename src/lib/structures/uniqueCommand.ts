import { OWNERS } from "#root/config";
import { Command, CommandOptionsRunTypeEnum } from "@sapphire/framework";
import { envParseString } from "@skyra/env-utilities";
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
            : [],
        register: true,
        ...options.chatInputCommand,
      },
      ...options,
    });
  }

  public get category(): string {
    return this.location.full.split(sep).reverse()[1] ?? "General";
  }
}

export declare namespace UniqueCommand {
  type Options = Command.Options;
  type JSON = Command.JSON;
  type Context = Command.Context;
  type AutocompleteInteraction = Command.AutocompleteInteraction;
  type ContextMenuInteraction = Command.ContextMenuInteraction;
  type Registry = Command.Registry;
}
