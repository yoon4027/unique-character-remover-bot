import { TOKEN } from "#root/config";
import { PrismaClient } from "@prisma/client";
import { container, SapphireClient } from "@sapphire/framework";

export class UniqueClient extends SapphireClient {
  public override async login() {
    const prisma = new PrismaClient();

    await prisma.$connect();
    container.prisma = prisma;
    container.logger.info("The database has been connected.");

    return await super.login(TOKEN);
  }
}
