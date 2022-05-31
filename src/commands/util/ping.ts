import { UniqueCommand } from "#lib/structures/uniqueCommand";
import type { APIMessage } from ".pnpm/discord-api-types@0.30.0/node_modules/discord-api-types/v10";
import { ApplyOptions, Enumerable } from "@sapphire/decorators";
import { send } from "@sapphire/plugin-editable-commands";
import { stripIndents } from "common-tags";
import type { Message } from "discord.js";

@ApplyOptions<UniqueCommand.Options>({
  description: "The command to check the api latency of this bot.",
})
export class UserCommand extends UniqueCommand {
  @Enumerable(false)
  public readonly responses = [
    "No.",
    "Not happening.",
    "Maybe later.",
    stripIndents`:ping_pong: Pong! \`$(ping)ms\`
    Heartbeat: \`$(heartbeat)ms\``,
    stripIndents`Just so you know, I'm not doing this for fun! \`$(ping)ms\`
    Doki doki: \`$(heartbeat)ms\``,
    stripIndents`Don't think this means anything special! \`$(ping)ms\`
    Heartbeat: \`$(heartbeat)ms\``,
    stripIndents`Can we get on with this already?! \`$(ping)ms\`
    Heartbeat: \`$(heartbeat)ms\``,
  ];

  public override async messageRun(message: Message<boolean>) {
    const msg = await send(message, "Ping?");
    if (!msg) return null;
    return await msg.edit({
      content: this.getResult(msg, message),
    });
  }

  public override async chatInputRun(
    interaction: UniqueCommand.ChatInputInteraction
  ): Promise<APIMessage | Message<boolean> | null> {
    const msg = await interaction.reply({
      fetchReply: true,
      content: "Ping?",
    });
    if (!msg) return null;
    return await interaction.editReply(
      this.getResult(msg as Message<boolean>, interaction)
    );
  }

  public override registerApplicationCommands(
    register: UniqueCommand.Registry
  ) {
    register.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  private getResult(
    msg: Message,
    message: Message<boolean> | UniqueCommand.ChatInputInteraction
  ) {
    return this.responses[Math.floor(Math.random() * this.responses.length)]
      .replace(
        "$(ping)",
        (
          (msg.editedTimestamp || msg.createdTimestamp) -
          ((message as Message).editedTimestamp || message.createdTimestamp)
        ).toString()
      )
      .replace(
        "$(heartbeat)",
        Math.round(this.container.client.ws.ping).toString()
      );
  }
}
