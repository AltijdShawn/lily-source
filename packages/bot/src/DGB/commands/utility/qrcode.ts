import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
import axios from "axios";
import {WinkDiceConfig as conf} from "@daydrm-studios/chatbot-config"

const store = basicStores;

const cmd: DGB_CMD = {
  name: "qrcode",
  aliases: ["qr"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv, stateHolder } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;

    let Emb: any;

    msg.reply("Waiting for response...");

    if (platform === "discord")
      Emb = new _.Embed()
        .setColor(0xffaa33)
        .setTitle("Command Unsupported on discord...")
        .setDescription(
          "\nThis command makes use of an external asset that discord can't reach.\n\nIf you really need to use this function then head over to the guilded server (if you are not already in there then just run `" +
            _.config.prefix +
            "invite`"
        );
    else
      Emb = new _.Embed()
        .setColor(0xf0f0f0)
        .setTitle("Your QR-Code")
        .setDescription(`${args.slice(1).join(" ")}`)
        .setImage(
          `${conf.PROD_REST_API_Endpoint}/api/gen/qrcode/${encodeURI(
            args.slice(1).join(" ")
          )}`
        );
    msg.reply({
      embeds: [Emb],
    });
  },
};
export default cmd;
