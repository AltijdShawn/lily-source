import { Message as dMessage } from "discord.js";
import { Message as gMessage } from "guilded.js";

import { CmdBaseClass2, CmdClass2 } from "../../../constructors/DGB/cmd_class";
import { _Extra } from "../../../types/DGB/command";
import { optsExamp } from "@daydrm-studios/chatbot-utils";
import { deleteData, getData, setData, setMap } from "../../mongo_usermaps";
import { discConfig } from "../..";

export default class extends CmdBaseClass2 implements CmdClass2 {
  public name = "adm_ucfg";
  public aliases = ["ucfg-admin", "uca"];

  private opts_1 = ["profile"];
  private opts_2 = ["delete", "create", "addid", "edit"];

  public async run() {
    try {
      const args = this.args;
      const msg = this.msg;
      if (!discConfig.privilegedUsers.includes(msg.author.id))
        return msg.reply("You are not privileged to use this command");
      // (msg as unknown as gMessage).mentions.users[0].id

      const mention =
        this.platform == "discord"
          ? (msg as unknown as dMessage).mentions
          : (msg as unknown as gMessage).mentions;

      let id = "";
      if (args[1] == null || args[1] == undefined)
        return msg.reply(
          "you need to give me either a profile ID or you need to mention the target user!"
        );
      else if (mention != undefined || mention != null)
        this.platform == "discord"
          ? //@ts-expect-error
            (id = mention.members.first().id)
          : (id = mention.users[0].id);
      else id = args[1];

      let data = null;

      if (mention != undefined || mention != null)
        data = await getData(this.platform, id);
      else if (args[1] == null || args[1] == undefined)
        data = await getData(this.platform, id);
      //@ts-expect-error
      else data == (await getData("prof_id", id)) && platform == "prof_id";

      // //@ts-expect-error
      // const user: dUser|gUser = platform == "discord" ? client.users.cache.get(id) : client.members.fetch(
      //     platform == "guilded" ? (msg as gMessage).channel.serverId : (msg as Message).guildId,
      //     id
      // )
      // //@ts-expect-error
      // const avatar = platform == "discord" ? user.avatarURL() : user.avatar

      // if (data == null) return msg.reply(`this user doesn't have a profile!`)
      return this.resp(id);
    } catch (e) {
      this.msg.reply(`An error occured\n\`\`\`ts\n${e}\n\`\`\``)
    }
  }

  private async resp(id) {
    const args = this.args;
    const msg = this.msg;

    switch (args[2]) {
      case "profile": {
        switch (args[3]) {
          case "delete": {
            const exists = await getData(this.platform, id);
            if (exists == null)
              return msg.reply(
                `You don't have a profile yet, please create one with \`${discConfig.prefix}user-config profile create\``
              );
            await deleteData(exists["prof_id"]);
            msg.reply(
              `successfully deleted your profile!\n\n` +
                `\`${JSON.stringify(
                  await getData(this.platform, id)
                )}\``
            );
          }
          case "create": {
            const exists = await getData(this.platform, id);
            if (exists != null)
              return msg.reply(
                `you are already registered!\nyour profile id is \`${exists["prof_id"]}\`!`
              );
            else {
              const prof_id = await this.newProfID();
              const platformId = id;
              const xp = 0;
              const otherPlatform =
                this.platform == "discord" ? "guilded" : "discord";
              const otherPlatformId = "";
              const description = "";

              const obj = {
                prof_id,
                total_xp: xp,
                level_xp: xp,
                level: 0,
                description,
                [this.platform]: platformId,
                [otherPlatform]: otherPlatformId,
              };
              await setData(prof_id, obj);

              return msg.reply(
                `profile created!\n\n` +
                  `\`${JSON.stringify(
                    await getData(this.platform, id)
                  )}\``
              );
            }
          }
          case "addid": {
            const otherPlatform =
              this.platform == "discord" ? "guilded" : "discord";
            if (!args[4])
              return msg.reply(
                `${
                  discConfig.prefix
                }user-config profile addid ${optsExamp(
                  "required",
                  "UserID from " + otherPlatform
                )}`
              );

            const exists = await getData(this.platform, id);
            if (exists == null)
              return msg.reply(
                `You don't have a profile yet, please create one with \`${discConfig.prefix}user-config profile create\``
              );
            const prof_id = exists["prof_id"];

            await setMap(prof_id, otherPlatform, args[3]);

            msg.reply(
              `successfully edited your profile!\n\n` +
                `\`${JSON.stringify(
                  await getData(this.platform, id)
                )}\``
            );
          }
          case "edit": {
            const otherPlatform =
              this.platform == "discord" ? "guilded" : "discord";
            const opts_3 = [
              "description",
              "total_xp",
              "level_xp",
              "prof_id",
              "level",
              this.platform,
              otherPlatform,
            ];
            const exists = await getData(this.platform, id);
            if (exists == null)
              return msg.reply(
                `You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``
              );
            const prof_id = exists["prof_id"];

            if (!args[4])
              return this.cmdClient.reply(
                `${discConfig.prefix}user-config profile ${optsExamp(
                  "required",
                  opts_3
                )} ${optsExamp("required", "...args")}`
              );

            // if (
            //   [
            //     "total_xp",
            //     "level_xp",
            //     "prof_id",
            //     "level",
            //     this.platform,
            //   ].includes(args[3])
            // ) {
            //   if (args[3] == this.platform)
            //     return msg.reply(
            //       `if you edit this and \`"${otherPlatform}"\` isn't set to the right value, then you will lose this profile... that's why we prevent you from doing this`
            //     );
            //   if (args[3] == "prof_id")
            //     return msg.reply(
            //       `this is a value that the bot uses to recognise you and cannot be changed`
            //     );
            //   if (args[3] == "total_xp")
            //     return msg.reply("you're smart.... but not *That* smart!");
            //   if (args[3] == "level_xp")
            //     return msg.reply("you're smart.... but not *That* smart!");
            //   if (args[3] == "level")
            //     return msg.reply("you're smart.... but not *That* smart!");
            // } else {
            if (!args[5])
              return this.cmdClient.reply(
                `${discConfig.prefix}user-config profile ${optsExamp(
                  "required",
                  opts_3
                )} ${optsExamp("required", "...args")}`
              );
            await setMap(
              prof_id,
              args[4],
              args.slice(5, args.length).join(" ")
            );
            msg.reply(
              `successfully edited your profile!\n\n` +
                `\`${JSON.stringify(
                  await getData(this.platform, id)
                )}\``
            );
            // }
          }
          // case "": {}
          default: {
            return this.cmdClient.reply(
              `${discConfig.prefix}user-config profile ${optsExamp(
                "required",
                this.opts_2
              )} ${optsExamp("optional", "...args")}`
            );
          }
        }
      }
      default: {
        return this.cmdClient.reply(
          `${discConfig.prefix}user-config ${optsExamp(
            "required",
            this.opts_1
          )} ${optsExamp("optional", "...args")}`
        );
      }
    }
  }

  private async newProfID(): Promise<string> {
    const id = this.makeid(16);
    const exists = await getData("prof_id", id);
    if (exists == null) return id;
    else return await this.newProfID();
  }

  private makeid(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
