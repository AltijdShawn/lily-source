import { 
  Message as dMessage, 
  EmbedBuilder as dEmbed, 
  User as dUser,
  Channel as dChannel,
  PermissionsBitField as PBF
} from "discord.js"
import { 
  Message as gMessage, 
  Embed as gEmbed,
  User as gUser,
  Channel as gChannel
} from "guilded.js"

import { Cmd } from "../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../stores/basic-stores";
import { DGB_CMD } from "../../types/DGB/command";
import { discConfig } from "..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "server-config",
  aliases: ["serverConf", "servercfg", "scfg"],
  execute: async (msg, args, cmd, platform, extra) => {
    const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg;
    const channelId = platform == "discord" ? mesg.channel.id : mesg.channelId 

    let perm;
    if (platform == "discord") perm = (_.msg.msg as dMessage<true>).member.permissions.has(PBF.Flags.ManageGuild);
    if (platform == "discord" && perm == false) perm = (_.msg.msg as dMessage<true>).member.permissions.has(PBF.Flags.Administrator);
    if (platform == "guilded") perm = (_.msg.msg as gMessage).member.isOwner;
    else perm = false
    if (perm == false) return msg.reply("insufficient permissions");


    if (args[1] == "channels") {
      if (args[2] == "NSFW" || args[2] == "nsfw") {
        if (args[3] == "Add" || args[3] == "add") {
          if(!args[4])  fw_.database.push("channels.nsfw", channelId);
          else if (discConfig.privilegedUsers.includes(msg.author.id)) fw_.database.push("channels.nsfw", args[4]);
          else return msg.reply("If you see this message and you are not an admin (or owner) of this guild/server then you either didn't trigger the message or you have done the impossible, anyways... basically the only one who should be able to add or remove channels to the list by ID is the bots developer!")

          const id = !args[4] ? channelId : args[4];
          return msg.reply(`Added \`${id}\` to the NSFW channel registry`)
        }
        if (args[3] == "Remove" || args[3] == "remove") {
          let arr = []
          if(!args[4]) arr = removeFromArray(await fw_.database.get("channels.nsfw"), channelId)
          else if (discConfig.privilegedUsers.includes(msg.author.id)) fw_.database.push("channels.nsfw", args[4]);
          else return msg.reply("If you see this message and you are not an admin (or owner) of this guild/server then you either didn't trigger the message or you have done the impossible, anyways... basically the only one who should be able to add or remove channels to the list by ID is the bots developer!")

          fw_.database.set("channels.nsfw", arr);

          const id = !args[4] ? channelId : args[4];
          return msg.reply(`Removed \`${id}\` from the NSFW channel registry`)
        }
        else return logNoValidOptions()
      }
      else return logNoValidOptions()
    }
    else return logNoValidOptions()

    function logNoValidOptions() {
      return msg.reply("No Valid options were provided")
    }
  },
};
export default cmd;

/** 
 * @template
 * @abstract
  {PREFIX}scfg
    | channels
      | NSFW
        | Add
        | Remove
 */