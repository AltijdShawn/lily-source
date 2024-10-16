import { Message as dMessage } from "discord.js";
import { Message as gMessage } from "guilded.js";

import { CmdBaseClass2, CmdClass2 } from "../../../constructors/DGB/cmd_class";
import { _Extra } from "../../../types/DGB/command";
import { optsExamp } from "@daydrm-studios/chatbot-utils";
import { deleteData, getData, setData, setMap } from "../../mongo_usermaps";
import { discConfig } from "../..";
import axios from "axios";

export default class extends CmdBaseClass2 implements CmdClass2 {
  public name = "reddit";
  public aliases = ["r", "meme"];

  private nsfwChannels: any[] = ["1095053394793738240", "d0474994-e11d-4b54-a28e-cd94e51c1f5f"]

  public async run() {
    this.nsfwChannels = await this.extra.fw_.database.get("channels.nsfw");
    const waitingMesg = await this.mesg.reply("Waiting for response...")
    const _ = this.cmdClient

    await axios.get(`https://www.reddit.com/r/${this.args[1]}/random/.json`).then((response: IResp) => {
      // console.log(response.data)
      const [list] = response.data;
      const [post] = list.data.children;
      
      const permalink = post.data.permalink;
      const memeUrl = `https://reddit.com${permalink}`;
      const memeImage = post.data.url;
      const memeTitle = post.data.title;
      const memeScore = {
        ups: post.data.ups,
        downs: post.data.downs,
        score: post.data.score
      };
      const memeNumComments = post.data.num_comments;
      const isNsfw = post.data.over_18;

      const channelId = this.platform == "discord" ? this.mesg.channel.id : this.mesg.channelId 

      let isGallery = (memeImage as unknown as string).startsWith("https://www.reddit.com/gallery/")

      waitingMesg.delete()
      let Emb: any;
      if (isNsfw && (!this.nsfwChannels.includes(channelId)))
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
        .setDescription(`[👍 ${memeScore.ups} | (${memeScore.score}) | ${memeScore.downs} 👎] 💬 ${memeNumComments}${isGallery ? "\n\nThis post is an image gallery... and we are working on making that work but for now we can't display any image" : ""}`)
        .setURL(memeUrl)
        .setImage(memeImage)
    _.msg.msg.reply({
      embeds: [Emb],
    });
      
      
      
    }).catch((e) => {
      waitingMesg.delete()
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
  }
}

interface IResp {
  data: IRedditResp[]
}

interface IRedditResp {
  // kind: TRedditRespKind,
  data: {
    // after: unknown | null,
    // dist: number,
    // modhash: string,
    // geo_filter:string,
    children: IRedditRespChildren[]
    // before: unknown | null
  }
}

interface IRedditRespChildren {
  // kind: TRedditRespKind,
  data: {
    permalink: string,
    url: string,
    title: string,
    ups: number,
    downs: number,
    score: number,
    num_comments: number,
    over_18: boolean,
  }
}

type TRedditRespKind = "Listing" | "t3"