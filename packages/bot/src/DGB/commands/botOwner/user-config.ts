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

import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
// import { Message as gMessage } from "guilded.js";
import { Message } from "discord.js";

import { deleteData, getData, setData, setMap } from "../../mongo_usermaps";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "adm_ucfg",
  aliases: ["ucfg-admim", "uia"],
  execute: async (msg, args, cmd, platform: any, extra) => {
    const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    if (!discConfig.privilegedUsers.includes(msg.author.id))
        return msg.reply("You are not privileged to use this command");
    // (msg as unknown as gMessage).mentions.users[0].id

    const mention = platform == "discord" ? (msg as unknown as Message).mentions: (msg as unknown as gMessage).mentions;

    let id = ""
    if (args[1] == null || args[1] == undefined) return msg.reply("you need to give me either a profile ID or you need to mention the target user!")
    //@ts-expect-error
    else if (mention != undefined || mention != null) platform == "discord" ? id = mention.members.first().id : id = mention.users[0].id 
    else id = args[1]

    let data = null

    if (mention != undefined || mention != null) data = await getData(platform, id)
    else if (args[1] == null || args[1] == undefined) data = await getData(platform, id)
    else data == await getData("prof_id", id) && platform == "prof_id"
    
    // //@ts-expect-error
    // const user: dUser|gUser = platform == "discord" ? client.users.cache.get(id) : client.members.fetch(
    //     platform == "guilded" ? (msg as gMessage).channel.serverId : (msg as Message).guildId,
    //     id
    // )
    // //@ts-expect-error
    // const avatar = platform == "discord" ? user.avatarURL() : user.avatar

    // if (data == null) return msg.reply(`this user doesn't have a profile!`)
    return resp()
    async function resp() {
        try {
            if (args[2] == "profile") {
                if (args[3] == "delete") {
                    const exists = await getData(platform, id)
                    if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
                    await deleteData(exists["prof_id"])
                    msg.reply(`successfully deleted the user's profile!\n\n` + `\`${JSON.stringify(await getData(platform, id))}\``)
                }
                else if (args[3] == "create") {
                    const exists = await getData(platform, id)
                    if (exists != null) return msg.reply(`you are already registered!\nthe user's profile id is \`${exists["prof_id"]}\`!`)
                    else {
                        const prof_id = await newProfID()
                        const platformId = id
                        const xp = 0
                        const otherPlatform = platform == "discord" ? "guilded" : "discord"
                        const otherPlatformId = ""
                        const description = ""
        
                        const obj = {
                            prof_id,
                            total_xp:xp,
                            level_xp:xp,
                            level:0,
                            description,
                            [platform]: platformId,
                            [otherPlatform]: otherPlatformId
                        }
                        await setData(prof_id, obj)
        
                        return msg.reply(`profile created!\n\n` + `\`${JSON.stringify(await getData(platform, id))}\``)
                    }
                }
                else if (args[3] == "addid") {
                    if (!args[4]) return logNoValidOptions()
        
                    const exists = await getData(platform, id)
                    if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
                    const prof_id = exists["prof_id"]
                    const otherPlatform = platform == "discord" ? "guilded" : "discord"
        
                    await setMap(prof_id, otherPlatform, args[4])
        
                    msg.reply(`successfully edited the user's profile!\n\n` + `\`${JSON.stringify(await getData(platform, id))}\``)
                }
                else if (args[3] == "edit") {
                    const exists = await getData(platform, id)
                    if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
                    const prof_id = exists["prof_id"]
                    const otherPlatform = platform == "discord" ? "guilded" : "discord"
        
                    if (!args[4]) return logNoValidOptions()
        
                    // if (["total_xp", "level_xp", "prof_id", platform].includes(args[3])) {
                    //     if (args[4] == platform) return msg.reply(`if you edit this and \`"${otherPlatform}"\` isn't set to the right value, then you will lose this profile... that's why we prevent you from doing this`)
                    //     if (args[4] == "prof_id") return msg.reply(`this is a value that the bot uses to recognise you and cannot be changed`)
                    //     if (args[4] == "total_xp") return msg.reply("you're smart.... but not *That* smart!")
                    //     if (args[4] == "level_xp") return msg.reply("you're smart.... but not *That* smart!")
                    // }
        
                    else {
                        if (!args[5]) return logNoValidOptions()
                        await setMap(prof_id, args[4], args.slice(5, args.length).join(" "))
                        msg.reply(`successfully edited the user's profile!\n\n` + `\`${JSON.stringify(await getData(platform, id))}\``)
                    }
        
                }
                else return logNoValidOptions()
              }
              else return logNoValidOptions()
          
              function logNoValidOptions() {
                return msg.reply("No Valid options were provided")
              }
        } catch (e) {
            return console.log(e)
        }
      }
  },
};
export default cmd;

async function newProfID(): Promise<string> {
    const id = makeid(16)
    const exists = await getData("prof_id", id)
    if (exists == null) return id
    else return await newProfID()
  }

  function makeid(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }