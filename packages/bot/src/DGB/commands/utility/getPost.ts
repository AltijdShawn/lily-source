import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig, tdServ } from "../..";
import axios from "axios";
import {WinkDiceConfig as conf} from "@daydrm-studios/chatbot-config"

const store = basicStores;

const cmd: DGB_CMD = {
  name: "getPost",
  aliases: ["getpost", "fetchpost", "fetchPost", "fpost", "gpost"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv, stateHolder } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg;

    msg.reply("Waiting for response...");

    await axios({
      method: "POST",
      url: `${conf.PROD_REST_API_Endpoint}/api/posts/getSpec`,
      data: { data: { post: { id: args[1] } } },
    })
      .then((resp) => {
        const res = resp.data;
        const post = res.post;
        if (post == null) {
          _.msg.msg.reply({
            embeds: [
              new _.Embed()
                .setColor(0xffaa33)
                .setTitle("Couldn't display post from website")
                .setDescription(
                  "Was not able to find a post with the corresponding id! (id: " +
                    args[1] +
                    ")"
                ) as any,
              // (new _.Embed()
              // .setColor(0xff3333)
              // .setTitle("Err logs")
              // .setDescription("```js\n"+e+"\n```") as any)
            ],
          });
        } else if ((post.content as unknown as string).length >= 1024) {
          _.msg.msg.reply({
            embeds: [
              new _.Embed()
                .setColor(0xaaaa33)
                .setTitle("This post exceeds the character limit")
                .setDescription(
                  `[the post](${conf.PROD_REST_API_Endpoint}/post/${args[1]})`
                ) as any,
            ],
          });
        } else if (
          (post.content as unknown as string).includes("<img") ||
          (post.content as unknown as string).includes("<iframe") ||
          (post.content as unknown as string).includes("<audio") ||
          (post.content as unknown as string).includes("<video")
        ) {
          _.msg.msg.reply({
            embeds: [
              new _.Embed()
                .setColor(0xaaaa33)
                .setTitle(
                  "This post contains media in a way that we cannot render!"
                )
                .setDescription(
                  `[the post](${conf.PROD_REST_API_Endpoint}/post/${args[1]})`
                ) as any,
            ],
          });
        } else {
          _.msg.msg.reply({
            embeds: [
              new _.Embed()
                .setColor(0x1c71d8)
                .setTitle(post.poster)
                .setDescription(
                  `[the post](${conf.PROD_REST_API_Endpoint}/post/${args[1]})`
                )
                .addFields([
                  {
                    name: post.title,
                    value: tdServ.turndown(post.content),
                    inline: false,
                  },
                ]) as any,
            ],
          });
        }
      })
      .catch((e) => {
        _.msg.msg.reply({
          embeds: [
            new _.Embed()
              .setColor(0xffaa33)
              .setTitle("Something went wrong")
              .setDescription(
                "We just don't know what!\n" +
                  `[the post](${conf.PROD_REST_API_Endpoint}/post/${args[1]})`
              ) as any,
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
