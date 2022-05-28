import { UniqueCommand } from "#lib/structures/uniqueCommand";
import { Enumerable } from "@sapphire/decorators";
import { send } from "@sapphire/plugin-editable-commands";
import { stripIndents } from "common-tags";
import { Message, MessageActionRow, MessageButton } from "discord.js";

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
      content: this.responses[Math.floor(Math.random() * this.responses.length)]
        .replace(
          "$(ping)",
          (
            (msg.editedTimestamp || msg.createdTimestamp) -
            (message.editedTimestamp || message.createdTimestamp)
          ).toString()
        )
        .replace(
          "$(heartbeat)",
          Math.round(this.container.client.ws.ping).toString()
        ),
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setEmoji("📨")
            .setLabel("Discord Status")
            .setURL("https://discordstatus.com")
            .setStyle("LINK")
        ),
      ],
    });
  }
}
