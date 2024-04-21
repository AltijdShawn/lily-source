import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "invite",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg;
    mesg.reply(`
  Discord: https://discord.gg/VtWA6WDvJr
  Guilded: https://www.guilded.gg/i/kKJrRXw2
  `);
  },
};
export default cmd;
