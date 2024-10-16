import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "send",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;

    const mesg = args.slice(1, args.length);
    if (!discConfig.privilegedUsers.includes(msg.author.id))
      return msg.reply("You are not privileged to use this command");
    else {
      fw_.sendWS({
        id: "sendAimedMesg",
        args: {
          target: "global",
          message: {
            text: `${mesg}`,
            position: "top-right",
            pauseOnHover: true,
            pauseOnFocusLoss: true,
          },
        },
      });
      return msg.reply("send");
    }
  },
};
export default cmd;
