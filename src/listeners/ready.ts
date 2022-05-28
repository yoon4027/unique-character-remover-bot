import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<Listener.Options>({
  event: Events.ClientReady,
})
export class UserListener extends Listener<typeof Events.ClientReady> {
  public run(client: Client<true>) {
    this.container.logger.info(`${client.user.tag}`);
  }
}
