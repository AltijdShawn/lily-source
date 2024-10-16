import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "say",
  aliases: ["sendmessage","sendchat","sendmsg","sendmesg", "message","chat","msg","mesg"],
  execute: (msg, args, cmd, platform, extra) => {
const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    if (!discConfig.privilegedUsers.includes(msg.author.id))
        return msg.reply("You are not privileged to use this command");

    msg.delete()
    msg.channel.send(args.slice(1, args.length).join(" "))
  },
};
export default cmd;
