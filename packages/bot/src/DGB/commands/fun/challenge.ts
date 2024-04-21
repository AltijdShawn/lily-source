import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
import axios from "axios";
import {WinkDiceConfig as conf} from "@daydrm-studios/chatbot-config"

import { giveXP } from "../../utils/level";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "challenge",
  aliases: ["quest"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv, stateHolder } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg;
    msg.reply("Waiting for response...");

    const msgTime = msg.createdAt.getTime();

    const d = new Date(msgTime);

    const dateTag = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    await axios
      .get(`${conf.REST_API_Endpoint}/api/challenge/${dateTag}`)
      .then((response) => {
        const data = response.data;

        const startDate = data["dateBoundries"]["start"];
        const endDate = data["dateBoundries"]["end"];
        async function output() {
          if (!args[1])
            return msg.reply({
              embeds: [
                new _.Embed()
                  .setTitle("Todays (" + data.date + ") quest/challenge!")
                  .setColor(0x42a69f)
                  .setDescription(data.question) as any,
              ],
            });
          else {
            if (data.answer == null) return msg.reply(`There is no answer set unfortunately`);
            if (
              (data.answer as string[]).includes(
                args.splice(1, args.length).join(" ").toLowerCase()
              )
            ) {
              msg.reply(
                `Congrats! you guessed it!\n\n**\`+100xp\`**`
              );
              giveXP(msg, platform, 100)
              } else return msg.reply(`:x: wrong!`);
          }
        }
        output();

        // msg.reply([
        //     `returned: \`${JSON.stringify(data)}\`.\n`,
        //     `is above (or equal to) startDate: \`${(msgTime >= startDate)}\`.\n`,
        //     `is below (or equal to) endDate: \`${(msgTime <= endDate)}\`.\n`
        // ].join(""))
      })
      .catch((e) => {
        _.msg.msg.reply({
          embeds: [
            new _.Embed()
              .setColor(0xffaa33)
              .setTitle("Couldn't display quest/challenge")
              .setDescription("Was not able to find a quest here!") as any,
            // (new _.Embed()
            // .setColor(0xff3333)
            // .setTitle("Err logs")
            // .setDescription("```js\n"+e+"\n```") as any)
          ],
        });
      });
    // msg.reply("8===>");
  },
};
export default cmd;
