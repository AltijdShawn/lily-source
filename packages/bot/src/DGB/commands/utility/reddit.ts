import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
import axios from "axios";

const store = basicStores;
let nsfwChannels: any[] = ["1095053394793738240", "d0474994-e11d-4b54-a28e-cd94e51c1f5f"]

const cmd: DGB_CMD = {
  name: "reddit",
  aliases: ["r", "meme"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv, stateHolder } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const mesg = _.msg.msg
    nsfwChannels = await fw_.database.get("channels.nsfw")

    msg.reply("Waiting for response...");

    await axios.get(`https://www.reddit.com/r/${args[1]}/random/.json`).then((response) => {
        const [list] = response.data
        const [post] = list.data.children;

        const permalink = post.data.permalink;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeImage = post.data.url;
        const memeTitle = post.data.title;
        const memeUpvotes = post.data.ups;
        const memeNumComments = post.data.num_comments;
        const nsfw = post.data.over_18;
        const channelId = platform == "discord" ? mesg.channel.id : mesg.channelId 

        let isGallery = (memeImage as unknown as string).startsWith("https://www.reddit.com/gallery/")

        let Emb: any;
        if (nsfw && (!nsfwChannels.includes(channelId)))
            Emb = new _.Embed()
              .setColor(0xffaa33)
              .setTitle("Couldn't display Reddit post")
              .setDescription(
                "this post was marked NSFW, but this channel is not for NSFW purposes!\nif you still want to see the post then go to `"
                + permalink + "`"
              );

        else Emb = new _.Embed()
          .setColor(0xFF5700)
          .setTitle(memeTitle)
          .setDescription(`👍 ${memeUpvotes} 💬 ${memeNumComments}${isGallery ? "\n\nThis post is an image gallery... and we are working on making that work but for now we can't display any image" : ""}`)
          .setURL(memeUrl)
          .setImage(memeImage)
      _.msg.msg.reply({
        embeds: [Emb],
      });
    }).catch((e) => {
        _.msg.msg.reply({
            embeds: [(new _.Embed()
                .setColor(0xffaa33)
                .setTitle("Couldn't display Reddit post")
                .setDescription("Was not able to find a post from the requested subreddit!") as any),
                // (new _.Embed()
                // .setColor(0xff3333)
                // .setTitle("Err logs")
                // .setDescription("```js\n"+e+"\n```") as any)
              ],
        });
    })
    // msg.reply("8===>");
  },
};
export default cmd;
