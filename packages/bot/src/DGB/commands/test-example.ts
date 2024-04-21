import { Cmd } from "../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../stores/basic-stores";
import { DGB_CMD } from "../../types/DGB/command";
import { discConfig } from "..";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "test",
  aliases: [],
  execute: (msg, args, cmd, platform, extra) => {
const {fw_, config, fnv, stateHolder} = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const Emb: any = new _.Embed().setTitle("hi").setDescription("uwu");
    _.msg.msg.reply({
      content: "# Hi\r\n`UwU`",
      embeds: [Emb],
    });
  },
};
export default cmd;
