import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "nfsend",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = args.slice(1, args.length);
    if (!discConfig.privilegedUsers.includes(msg.author.id))
      return msg.reply("You are not privileged to use this command");
    else {
      fw_.sendWS({
        id: "notification_send",
        args: {
          msg: `${mesg.join(" ")}`,
          data: {
            authToken: config.token,
            target: "main",
            sender: config.username,
            content: msg.content,
            meta: {
              sessionId: "000000",
            },
          },
        },
      });
      msg.reply(`send`);
      return;
    }
  },
};
export default cmd;
