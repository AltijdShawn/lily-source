import { Cmd } from "../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../stores/basic-stores";
import { DGB_CMD } from "../../types/DGB/command";
import { discConfig } from "..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
    const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    msg.reply("8===>")
  },
};
export default cmd;
