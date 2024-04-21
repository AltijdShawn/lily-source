import * as trndwn from "turndown"
import {WinkDiceConfig as conf, chatbotsConfig as cfg, findMap} from "@daydrm-studios/chatbot-config"

import {
  Client as Disc,
  Events as DEvents,
  GatewayIntentBits,
  EmbedBuilder as DEmbed,
} from "discord.js";
import {
  Client as Guild,
  Embed as GEmbed,
  Message as gMessage,
} from "guilded.js";
//   import chalk from "chalk";

import {
  v2 as framework,
  Command,
  v2_T,
  v2,
  config_,
  Message,
} from "../framework";
import {
  Message as dMessage,
  Collection,
  Client,
  Events,
  SlashCommandBuilder,
  CommandInteraction,
  InteractionResponse,
  REST,
  Routes,
  GatewayIntentBits as GW,
} from "discord.js";
import { Cmd } from "../CmdClient";
import { secondsToString as tFormat } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../stores/basic-stores";
import { readdirSync } from "fs";
import { DGB_CMD } from "../types/DGB/command";

import { giveXP } from "./utils/level";

const store = basicStores;

export const discConfig = cfg.client


/**
 *
 * @param fw_
 *
 * @param config
 *
 * @param fnv
 * * @description "Functions aNd Variables"
 */

export const DGB = (fw_, config, fnv) => loop(fw_, config, fnv);

function loop(fw_, config, fnv) {
  try {
    const { makeid, ToggleSpam, stateHolder } = fnv;

    const discord = new Disc({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    const guilded = new Guild({ token: cfg.guilded_bot_token });
    // ? GUILDED CLIENT
    guilded.on("ready", () => {
      console.log("guilded");
    });
    guilded.on("messageCreated", async (msg) => {
      const message = msg;
      const args: string[] = msg.content.split(" ");
      const cmd: string = args[0].replace(discConfig.prefix, "");

      // if(discConfig.privilegedUsers.includes(msg.authorId)) {
      //   msg.reply(`${JSON.stringify(msg.embeds)}`)
      // }

      if (msg.authorId == guilded.user.botId) return;
      if (msg.content == "") return;

      await giveXP(msg, "guilded")
      // if (msg.author.id == guilded.user.id) return;

      // if (!message.guild || message.author.bot) return;
      if (message.content.startsWith(discConfig.prefix))
        return await cmdHandler(message, "guilded");
      else return Disc2Guild();

      async function Disc2Guild() {
        console.log(
          /*chalk.yellow*/ "[GUILDED]" +
            " (" +
            msg.channelId +
            ") " +
            msg.author?.name +
            " > " +
            msg.content
        );
        const discordMessage = {
          username: "",
          content: "",
          avatarURL: "",
          channel: {},
          allowed_mentions: ["roles", "users"],
        };
        let author =
          msg.author ||
          (await msg.client.users.cache.get(String(msg.authorId)));
        if (!author) return;
        discordMessage.username = author?.name || "Guilded Bridge";
        discordMessage.avatarURL = author?.avatar;
        discordMessage.content =
          msg.content == "" ? "{**EMPTY MESSAGE**}" : msg.content;
        discordMessage.channel = msg.channel;

        sendDiscordEmbed(await msg.channelId, discordMessage);
      }
    });

    // ? DISCORD CLIENT
    discord.on("ready", () => {
      console.log("discord");
    });
    discord.on(DEvents.MessageCreate, async (msg: dMessage<true>) => {
      let message = msg;
      const args: string[] = msg.content.split(" ");
      const cmd: string = args[0].replace(discConfig.prefix, "");

      // if(discConfig.privilegedUsers.includes(msg.author.id)) {
      //   msg.reply(`${JSON.stringify(msg.embeds)}`)
      // }

      if (!message.guild || message.author.id == discord.user.id) return;

      await giveXP(msg, "discord")

      if (message.content.startsWith(discConfig.prefix))
        return await cmdHandler(message, "discord");
      else return Disc2Guild();

      async function Disc2Guild() {
        console.log(
          /*chalk.blue*/ "[DISCORD]" +
            " (" +
            msg.channel?.name +
            ") " +
            msg.author.username +
            " > " +
            msg.content
        );
        const guildedMessage = {
          username: "",
          content: "",
          channel: {},
          avatarURL: "",
          allowed_mentions: ["roles", "users"],
        };
        let author = msg.author;
        if (author.username == discord.user.username) return;

        guildedMessage.avatarURL = author.avatarURL();
        guildedMessage.username = author.username;
        guildedMessage.content =
          msg.content == "" ? "{**EMPTY MESSAGE**}" : msg.content;
        guildedMessage.channel = msg.channel;

        sendGuildedEmbed(await msg.channelId, guildedMessage);
      }
    });
    // ? FUNCTIONS
    async function sendDiscordEmbed(dChannel, message) {
      const ChannelMapIndex = findMap("guilded", dChannel);
      if (ChannelMapIndex === 0) return;

      console.log(ChannelMapIndex);
      const target = cfg.channelmap[ChannelMapIndex].discord;
      console.log(target);
      const Emb = new DEmbed()
        .setColor(0x131313)
        .setThumbnail(message.avatarURL)
        .setTitle(message.username + " < [" + message.channel?.name + "]")
        .setDescription(message.content)
        .setFooter({
          text: "CyBR - DGB [Guilded]",
          //@ts-expect-error
          iconUrl: "https://guilded.gg/asset/Icons/ms-icon-144x144.png?v=3",
        });

      //@ts-expect-error
      (await discord.channels.fetch(String(target))).send({
        embeds: [Emb],
      });
    }

    async function sendGuildedEmbed(gChannel, message) {
      const ChannelMapIndex = findMap("discord", gChannel);
      if (ChannelMapIndex === 0) return;

      console.log(ChannelMapIndex);
      const target = cfg.channelmap[ChannelMapIndex].guilded;
      console.log(target);
      const Emb = new GEmbed()
        .setColor(0x131313)
        .setThumbnail(message.avatarURL)
        .setTitle(message.username + " < [" + message.channel?.name + "]")
        .setDescription(message.content)
        .setFooter(
          "CyBR - DGB [Discord]",
          "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico"
        );

      (await guilded.channels.fetch(target))
        .send({
          embeds: [Emb],
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    }

    discord.login(cfg.discord_bot_token);
    guilded.login();

    async function cmdHandler(msg, platform): Promise<any> {
      const message = msg;
      const args: string[] = msg.content.split(" ");
      const cmd: string = args[0].replace(discConfig.prefix, "");

      const command: DGB_CMD = (store.commands.get(cmd) as DGB_CMD);
      try {
        command.execute(msg, args, cmd, platform, {fw_, config, fnv, stateHolder});
      } catch (e) {
        message.reply(
          "Something went wrong, please contact the developer if you really need this fixed quickly"
        );
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
    fw_.reportIncident("error", e, {
      file: "src/DGB/index.ts",
      timestamp: Date.now()
    });
    loop(fw_, config, fnv);
  }
}

// readdirSync
const command_folders = readdirSync("src/DGB/commands");
for (const folder of command_folders) {
  console.log(folder)
  if (folder.endsWith(".ts")) register(folder, "commands")
  else {
    const command_folders = readdirSync("src/DGB/commands/"+folder);
    for (const folder2 of command_folders) {
      console.log(folder+"/"+folder2)
      if (folder2.endsWith(".ts")) register(folder2, "commands/"+folder)
      // else {
    
      // }
}
  }
}
// for (const file of commands) {

// }

async function register(file, path) {
  const fileName = file.split(".")[0];
  const command = (await import(`./${path}/${fileName}`)).default;
  console.log(
    `+ [Command handler] Attempting to load: ${file} (main cmd name: ${command.name})`
  );
  store.commands.set(command.name, command);
  for (const alias of command.aliases) {
    console.log(
      `   | [Command handler] Attempting to attach: alias cmd name '${alias}' to file '${file}' (main cmd name: ${command.name})`
    );
    store.commands.set(alias, command);
  }
}

const trndwnServ = new trndwn.default({})
trndwnServ.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: function (content) {
    return '~~' + content + '~~'
  }
})
trndwnServ.addRule('linebreak', {
  filter: ['br'],
  replacement: function (content) {
    return '\n' + content
  }
})
trndwnServ.addRule('paragraph', {
  filter: 'p',
  replacement: function (content) {
    return '\n\n' + content + '\n\n'
  }
})
trndwnServ.addRule("anchor", {
  //@ts-expect-error
  filter: function (node, options) {
    return (
      options.linkStyle === 'inlined' &&
      node.nodeName === 'A' &&
      node.getAttribute('href')
    )
  },
  replacement: function(content, node, options) {
    //@ts-expect-error
    if (node.getAttribute("href").startsWith("/")) return `[${content}](${conf.PROD_REST_API_Endpoint}${node.getAttribute("href")})`
    //@ts-expect-error
    else return `[${content}](${node.getAttribute("href")})`
  }
})

export const tdServ = trndwnServ