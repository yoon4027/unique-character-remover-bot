/** References are from :https://github.com/Stereo-Developers/stereo-v2/blob/main/src/core/database/providers/GuildProvider.ts */

import { PREFIXES } from "#root/config";
import type { Settings } from "@prisma/client";
import { container } from "@sapphire/framework";
import { Collection, Guild } from "discord.js";
import _ from "dot-prop";
import { EventEmitter } from "events";

const defaultSettings = {
  prefix: PREFIXES,
};

interface settings {
  prefix: string[] | string;
}
export class SettingsProvider extends EventEmitter {
  public items = new Collection<string, any>();

  public async loadAll(): Promise<void> {
    this.emit("initialized");

    for (const guild of await container.prisma.settings.findMany())
      this.items.set(guild.id, JSON.parse(guild.data));
  }

  public get<T extends any>(
    guild: string | Guild,
    setting: string,
    defaultValue?: T
  ): T {
    let entry =
      this.items.get(SettingsProvider.getGuildID(guild)) ?? defaultSettings;
    return _.get(entry, setting) ?? (defaultValue as T);
  }

  public getRaw(guild: string | Guild): settings {
    return this.items.get(SettingsProvider.getGuildID(guild));
  }

  public async set(
    guild: string | Guild,
    setting: string,
    value: any
  ): Promise<Settings> {
    let item =
      this.items.get(SettingsProvider.getGuildID(guild)) ??
      (await this.ensureTable(SettingsProvider.getGuildID(guild)));
    _.set(item, setting, value);
    this.items.set(SettingsProvider.getGuildID(guild), item);

    this.emit("set", guild, setting, value);

    return await container.prisma.settings.update({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async delete(guild: string | Guild, setting: string) {
    const item =
      this.items.get(SettingsProvider.getGuildID(guild)) ??
      (await this.ensureTable(SettingsProvider.getGuildID(guild)));
    _.delete(item, setting);
    this.items.set(SettingsProvider.getGuildID(guild), item);

    this.emit("delete", guild, setting);

    return await container.prisma.settings.update({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async clear(guild: string | Guild): Promise<Settings> {
    this.items.delete(SettingsProvider.getGuildID(guild));

    this.emit("clear", guild);

    return await container.prisma.settings.delete({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
    });
  }

  public async ensureTable(guild: string | Guild): Promise<settings> {
    let item = this.items.get(SettingsProvider.getGuildID(guild));
    if (!item) {
      await container.prisma.settings.create({
        data: {
          id: SettingsProvider.getGuildID(guild),
          data: JSON.stringify(defaultSettings),
        },
      });
      item = defaultSettings;
    }

    return item;
  }

  public static getGuildID(guild: string | Guild): string {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError("its undefined dumbass");
  }
}
