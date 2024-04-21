import { 
    Message as dMessage, 
    EmbedBuilder as dEmbed, 
    User as dUser,
    Channel as dChannel,
    FetchMessagesOptions
} from "discord.js"
import { 
    Message as gMessage, 
    Embed as gEmbed,
    User as gUser,
    Channel as gChannel
} from "guilded.js"
import { discConfig } from "../DGB"

export function Cmd(m: msgObj, platform?: pltfrm) {
    console.log("This also")
//! Maps
    const common = {
        reply: (content: string) => m.msg.reply(content),
        author: m.msg.author,
        channel: m.msg.channel,
        Embed: null,
        msg: m,
        config: discConfig,
        $def_TEST001: {
            $def_TEST001: "test001-str",
            $def_TEST002: "test002-str",
            $def_TEST003: "test003-str"
        }
    }
    const discord = {
        ...common,
        Embed: dEmbed,
    }
    const guilded = {
        ...common,
        Embed: gEmbed,
    }
//! Remaps
    /**
     * @Discord
     */
    discord["$def_TEST001"]["$def_TEST004"] = "tiskort"
    // // @ts-expect-error
    // discord.msg.msg.channel["fetchMessages"] = (options?: FetchMessagesOptions) => discord.msg.msg.channel.messages.fetch(options)
    /**
     * @Guilded
     */
    guilded["$def_TEST001"]["$def_TEST004"] = "giltet"
    // guilded["msg"]["msg"]["channel"]["id"] = guilded.msg.msg.channelId
//! Out
    if (platform === "discord") return (discord as unknown as cmdRet);
    else if (platform === "guilded") return (guilded as unknown as cmdRet);
    else return (common as unknown as cmdRet);
}

interface cmdRet {
    reply: (content: string)=>Promise<gMessage>|Promise<dMessage<true>>|Promise<dMessage<false>>;
    author: dUser|gUser;
    channel: dChannel|gChannel;
    Embed: typeof dEmbed|typeof gEmbed|null;
    msg: msgObj;
    config: typeof discConfig;
    uwuntu: {
        [key: string|number|symbol]: any;
    }
}

interface msgObj {
    msg: dMessage<false>|dMessage<true>|gMessage;
    args: string[];
    cmd: string;
}
type pltfrm = "guilded"|"discord"|""|undefined|null;

// let a: dMessage<false>;
// a.client.user.avatarURL()
// let b: gMessage;
// b.client.user.avatar