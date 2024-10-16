import { CmdBaseClass2, CmdClass2 } from "../../constructors/DGB/cmd_class";
import { _Extra } from "../../types/DGB/command";
import { optsExamp } from "@daydrm-studios/chatbot-utils";
import { deleteData, getData, setData, setMap } from "../mongo_usermaps";
import { discConfig } from "..";

export default class extends CmdBaseClass2 implements CmdClass2 {
  public name = "user-config";
  public aliases = ["userConf", "usercfg", "ucfg"];

  private opts_1 = ["profile"];
  private opts_2 = ["delete", "create", "addid", "edit"];

  public async run() {
    const args = this.args;
    const msg = this.msg;

    switch (args[1]) {
      case "profile": {
        switch (args[2]) {
          case "delete": {
            const exists = await getData(this.platform, msg.author.id);
            if (exists == null)
              return msg.reply(
                `You don't have a profile yet, please create one with \`${discConfig.prefix}user-config profile create\``
              );
            await deleteData(exists["prof_id"]);
            msg.reply(
              `successfully deleted your profile!\n\n` +
                `\`${JSON.stringify(
                  await getData(this.platform, msg.author.id)
                )}\``
            );
          }
          case "create": {
            const exists = await getData(this.platform, msg.author.id);
            if (exists != null)
              return msg.reply(
                `you are already registered!\nyour profile id is \`${exists["prof_id"]}\`!`
              );
            else {
              const prof_id = await this.newProfID();
              const platformId = msg.author.id;
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
                    await getData(this.platform, msg.author.id)
                  )}\``
              );
            }
          }
          case "addid": {
            const otherPlatform =
              this.platform == "discord" ? "guilded" : "discord";
            if (!args[3])
              return msg.reply(
                `${
                  discConfig.prefix
                }user-config profile addid ${optsExamp(
                  "required",
                  "UserID from " + otherPlatform
                )}`
              );

            const exists = await getData(this.platform, msg.author.id);
            if (exists == null)
              return msg.reply(
                `You don't have a profile yet, please create one with \`${discConfig.prefix}user-config profile create\``
              );
            const prof_id = exists["prof_id"];

            await setMap(prof_id, otherPlatform, args[3]);

            msg.reply(
              `successfully edited your profile!\n\n` +
                `\`${JSON.stringify(
                  await getData(this.platform, msg.author.id)
                )}\``
            );
          }
          case "edit": {
            const opts_3 = ["description"]
            const exists = await getData(this.platform, msg.author.id)
            if (exists == null) return msg.reply(`You don't have a profile yet, please create one with \`${discConfig.prefix}ucfg profile create\``)
            const prof_id = exists["prof_id"]
            const otherPlatform = this.platform == "discord" ? "guilded" : "discord"

            if (!args[3]) return this.cmdClient.reply(
              `${discConfig.prefix}user-config profile ${optsExamp(
                "required",
                opts_3
              )} ${optsExamp("required", "...args")}`
            );

            if (["total_xp", "level_xp", "prof_id", "level", this.platform].includes(args[3])) {
                if (args[3] == this.platform) return msg.reply(`if you edit this and \`"${otherPlatform}"\` isn't set to the right value, then you will lose this profile... that's why we prevent you from doing this`)
                if (args[3] == "prof_id") return msg.reply(`this is a value that the bot uses to recognise you and cannot be changed`)
                if (args[3] == "total_xp") return msg.reply("you're smart.... but not *That* smart!")
                if (args[3] == "level_xp") return msg.reply("you're smart.... but not *That* smart!")
                if (args[3] == "level") return msg.reply("you're smart.... but not *That* smart!")
            }

            else {
                if (!args[4]) return this.cmdClient.reply(
              `${discConfig.prefix}user-config profile ${optsExamp(
                "required",
                opts_3
              )} ${optsExamp("required", "...args")}`
            );
                await setMap(prof_id, args[3], args.slice(4, args.length).join(" "))
                msg.reply(`successfully edited your profile!\n\n` + `\`${JSON.stringify(await getData(this.platform, msg.author.id))}\``)
            }
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
