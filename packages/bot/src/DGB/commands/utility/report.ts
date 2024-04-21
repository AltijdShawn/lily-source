import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray, FlagEngine } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
import axios from "axios";
import {WinkDiceConfig as conf} from "@daydrm-studios/chatbot-config"

const store = basicStores;

const cmd: DGB_CMD = {
  name: "report",
  aliases: ["newbug"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg;

    const PossiblePlatforms:string[] = ["discord","guilded","minecraft-lifesteal","roblox-citylife","xim","winkdice"]

    _.reply(`
    [MESSAGE FROM THE DEV]
    Long and descriptive reports should not be done through here since chat programs like discord and guilded are made for chatting,
    not for writing long reports.

    it's best to just go to the website: ${conf.PROD_REST_API_Endpoint}/bugs/new
    [--------------------]
    `)

    const FE = new FlagEngine("--", [])
    const flg = (name:string) => FE.getFlag(name, _.msg.args.join(" ")).value

    if (flg("severity") == '' || flg("title") == '' || flg("desc") == '') return _.reply(`
        \`--severity\`, \`--title\` and/or \`--desc\` are not provided
        Please give me some arguments!
        Example: \`${discConfig.prefix}report (--platform="<Platform>") --severity=<["minor"|"problematic"|"fatal"]> --title="<Some Title>" --desc="<Some Description>"\`

        Possible Platforms are: <${PossiblePlatforms.join(" | ")}>, Alternatively you can not include that flag and then the bot will assume the chat platform you are currently typing this on!
    `)


    const platform_: string = flg("platform") == '' ? platform : flg("platform")

    if (!PossiblePlatforms.includes(platform_)) return _.reply(`
      Invalid platform, valid platforms are: <${PossiblePlatforms.join(" | ")}>

    **\`(Source: this.command.invalidArgsPrompt)\`**
    \`\`\`ts
    /* QUOTE::START */
    Please give me some arguments!
    Example: \`${discConfig.prefix}report (--platform="<Platform>") --severity=<["minor"|"problematic"|"fatal"]> --title="<Some Title>" --desc="<Some Description>"\`
    /* QUOTE::END */
    \`\`\`
    `)

    const report: IBugReport = {
        platform: platform_,
        user: msg.member.displayName,
        severity: flg("severity"),
        title: flg("title"),
        description: flg("desc")
    }

    console.log(report)

    await axios({
        method: "POST",
        url: `${conf.PROD_REST_API_Endpoint}/api/bug/new`,
        data: {data:report},
      }).then((res) => {
        _.reply("Successfully send")
      })
  },
};
export default cmd;



interface IBugReport {
    id?: string;
    platform?: string;
    user?: string;
    severity?: string;
    title?: string;
    description?: string;
}
