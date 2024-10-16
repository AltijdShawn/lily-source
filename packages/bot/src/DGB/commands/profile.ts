import { 
    Message as dMessage, 
    EmbedBuilder as dEmbed, 
    User as dUser,
    Channel as dChannel
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
// import { Message as gMessage } from "guilded.js";
import { Message } from "discord.js";

import { getData } from "../mongo_usermaps";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "profile",
  aliases: ["userinfo", "ui", "user"],
  execute: async (msg, args, cmd, platform, extra) => {
    const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    // (msg as unknown as gMessage).mentions.users[0].id

    const mention = platform == "discord" ? (msg as unknown as Message).mentions: (msg as unknown as gMessage).mentions;

    let id = ""
    if (args[1] == null || args[1] == undefined) id = msg.author.id
    //@ts-expect-error
    else if (mention != undefined || mention != null) platform == "discord" ? id = mention.members.first().id : id = mention.users[0].id 
    else id = args[1]

    let data = null

    if (mention != undefined || mention != null) data = await getData(platform, id)
    else if (args[1] == null || args[1] == undefined) data = await getData(platform, id)
    else data = await getData("prof_id", id)
    
    // //@ts-expect-error
    // const user: dUser|gUser = platform == "discord" ? client.users.cache.get(id) : client.members.fetch(
    //     platform == "guilded" ? (msg as gMessage).channel.serverId : (msg as Message).guildId,
    //     id
    // )
    // //@ts-expect-error
    // const avatar = platform == "discord" ? user.avatarURL() : user.avatar

    if (data == null) return msg.reply(`this user doesn't have a profile!`)
    else return resp()
    function resp() {
        try {
            msg.reply({
            embeds: [
                (new _.Embed()
                    .setTitle("UserInfo")
                    .setColor(0xFFaaBF)
                    // .setImage(avatar)
                    .addFields([
                        {name: "Description", value: data.description || "none"},
                        {name: "xp", value: String(data.total_xp), inline: true},
                        {name: "level", value: String(data.level), inline: true},
                    ]) as any)
                ]
            })
        } catch (e) {
            return console.log(e)
        }
    }
  },
};
export default cmd;
