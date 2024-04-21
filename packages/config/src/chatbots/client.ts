import { tokens } from "./tokens";

import { GatewayIntentBits as GW } from "discord.js";


export const client = {
    clientId: "<DISCORD BOT CLIENT ID>",
    privilegedUsers: ["<THIS LIST CONTAINS BOTH DISCORD AND GUILDED USER IDS FOR ADMINS>"],
    prefix: tokens.prefix,
    intents: [GW.GuildMessages, GW.MessageContent, GW.GuildMembers],
    guilds: {
      Discord: "<DISCORD SERVER INVITE LINK>",
      Guilded: "<GUILDED SERVER INVITE LINK>"
    }
  };
