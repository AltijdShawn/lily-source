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

  import { deleteData, getData, setData, setMap } from "../mongo_usermaps";
  
  import { Cmd } from "../../CmdClient";
  import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
  import { basicStores } from "../../stores/basic-stores";
  import { DGB_CMD } from "../../types/DGB/command";
  import { discConfig } from "..";

  const store = basicStores;
  
  const cmd: DGB_CMD = {
    name: "user-config",
    aliases: ["userConf", "usercfg", "ucfg"],
    execute: async (msg, args, cmd, platform, extra) => {
      const {fw_, config, fnv, stateHolder} = extra;
      const _ = Cmd({ msg, args, cmd }, platform);
      const client = _.msg.msg.client;
      const mesg = _.msg.msg;
      const channelId = platform == "discord" ? mesg.channel.id : mesg.channelId 
  
    //   let perm;
    //   if (platform == "discord") perm = (_.msg.msg as dMessage<true>).member.permissions.has(PBF.Flags.ManageGuild);
    //   if (platform == "discord" && perm == false) perm = (_.msg.msg as dMessage<true>).member.permissions.has(PBF.Flags.Administrator);
    //   if (platform == "guilded") perm = (_.msg.msg as gMessage).member.isOwner;
    //   else perm = false
    //   if (perm == false) return msg.reply("insufficient permissions");
  
  
      if (args[1] == "profile") {
        if (args[2] == "delete") {
            const exists = await getData(platform, msg.author.id)
            if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
            await deleteData(exists["prof_id"])
            msg.reply(`successfully deleted your profile!\n\n` + `\`${JSON.stringify(await getData(platform, msg.author.id))}\``)
        }
        else if (args[2] == "create") {
            const exists = await getData(platform, msg.author.id)
            if (exists != null) return msg.reply(`you are already registered!\nyour profile id is \`${exists["prof_id"]}\`!`)
            else {
                const prof_id = await newProfID()
                const platformId = msg.author.id
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

                return msg.reply(`profile created!\n\n` + `\`${JSON.stringify(await getData(platform, msg.author.id))}\``)
            }
        }
        else if (args[2] == "addid") {
            if (!args[3]) return logNoValidOptions()

            const exists = await getData(platform, msg.author.id)
            if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
            const prof_id = exists["prof_id"]
            const otherPlatform = platform == "discord" ? "guilded" : "discord"

            await setMap(prof_id, otherPlatform, args[3])

            msg.reply(`successfully edited your profile!\n\n` + `\`${JSON.stringify(await getData(platform, msg.author.id))}\``)
        }
        else if (args[2] == "edit") {
            const exists = await getData(platform, msg.author.id)
            if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
            const prof_id = exists["prof_id"]
            const otherPlatform = platform == "discord" ? "guilded" : "discord"

            if (!args[3]) return logNoValidOptions()

            if (["total_xp", "level_xp", "prof_id", platform].includes(args[3])) {
                if (args[3] == platform) return msg.reply(`if you edit this and \`"${otherPlatform}"\` isn't set to the right value, then you will lose this profile... that's why we prevent you from doing this`)
                if (args[3] == "prof_id") return msg.reply(`this is a value that the bot uses to recognise you and cannot be changed`)
                if (args[3] == "total_xp") return msg.reply("you're smart.... but not *That* smart!")
                if (args[3] == "level_xp") return msg.reply("you're smart.... but not *That* smart!")
            }

            else {
                if (!args[4]) return logNoValidOptions()
                await setMap(prof_id, args[3], args.slice(4, args.length).join(" "))
                msg.reply(`successfully edited your profile!\n\n` + `\`${JSON.stringify(await getData(platform, msg.author.id))}\``)
            }

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