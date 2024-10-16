import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "overload2",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
const {fw_, config, fnv, stateHolder} = extra;
const {ToggleSpam} = fnv
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = args.slice(1, args.length);
    if (!discConfig.privilegedUsers.includes(msg.author.id))
      return msg.reply("You are not privileged to use this command");
    else {
      fw_.sendWS({
        id: "setcookie",
        args: {
          key: "epilepsyMode",
          value: !stateHolder.spam,
          exp: ''
        },
      });

      ToggleSpam(
        {
          chatId: 0,
          sendBy: "",
          target: "main",
          content: "",
          cmd: "",
          args_meta: [""],
          args: [""],
        },
        fw_,
        (state) => {
          fw_.sendWS({
            id: "modal",
            args: {
              title: "Frick You",
              content: `<header style="color:var(--theme-fg)">Total Annoyance = enabled, you can't do anything on the site rn</header>`,
              targets: ["global"],
            },
          });
        }
      );
      console.log(stateHolder)
      msg.reply(`Spam loop is set to ${stateHolder.spam}`);
      return;
    }
  },
};
export default cmd;
