import { Cmd } from "../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../stores/basic-stores";
import { DGB_CMD } from "../../types/DGB/command";
import { discConfig } from "..";
import { pkg } from "../../package";

const store = basicStores;

// if (["info", "botinfo", "bi"].includes(cmd)) {
// }

const cmd: DGB_CMD = {
  name: "botinfo",
  // aliases: [],
    aliases: ["info", "bi"],
  execute: (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;

    // @ts-expect-error
    const avatar = platform == "discord" ? client.user.avatarURL() : client.user.avatar

    const Emb: any = new _.Embed()
      .setColor(0x9a3afa)
      .setTitle("Bot Info")
      .setThumbnail(avatar)
      .addFields([
        // { name: "name", value: "", inline: false},
        {
          name: "Prefix",
          value: `\`${discConfig.prefix}\``,
          inline: true,
        },        {
          name: "Links",
          value: `[Website](${config.PROD_REST_API_Endpoint})\n[Discord](${discConfig.guilds.Discord})\n[Guilded](${discConfig.guilds.Guilded})\n`,
          inline: true,
        },
        {
          name: "Bot Latency",
          value: `${Date.now() - _.msg.msg.createdAt.getTime()}ms`,
          inline: false,
        },
        { name: "API Latency", value: `${client.ws.ping}ms`, inline: true },
        {
          name: "Uptime",
          value: tFormat(store.counters.get("uptime")),
          inline: false,
        },
        {
          name: "Versions",
          value: `Node.js: \`${process.versions.node}\`\nGuilded.js: \`${pkg.dependencies["guilded.js"]}\`\nDiscord.js: \`${pkg.dependencies["discord.js"]}\``,
          inline: false,
        },
      ]);
    _.msg.msg.reply({
      embeds: [Emb],
    });
  },
};
export default cmd;
