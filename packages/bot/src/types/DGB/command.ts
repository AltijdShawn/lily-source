import { 
    Message as dMessage, 
    EmbedBuilder as dEmbed, 
    User as dUser,
    Channel as dChannel
} from "discord.js"
import { 
    Message as gMessage, 
    Embed as gEmbed,
    User as gUser,
    Channel as gChannel
} from "guilded.js"
import { v2_T, Message } from "../../framework";

export interface DGB_CMD {
    name: string;
    aliases: string[];
    execute: (msg: msg_, args: string[], cmd: string, platform: pltfrm, extra: _Extra) => any
}

interface _Extra {
    fw_: v2_T;
    config: any;
    fnv: {
        makeid: (length: number) => string,
        ToggleSpam: (msg: Message, fw: v2_T, extraFunc?: (state:any) => any) => stateHolder
    };
    stateHolder: stateHolder
}

interface stateHolder {
    spam: boolean;
    spamExtraFunc: () => void;
    count: {
        Onesec: number;
    };
}

interface cmdRet {
    reply: (content: string)=>Promise<gMessage>|Promise<dMessage<true>>|Promise<dMessage<false>>;
    author: dUser|gUser;
    channel: dChannel|gChannel;
    Embed: typeof dEmbed|typeof gEmbed|null;
    msg: msgObj;
}

interface msgObj {
    args: string[];
    cmd: string;
}
type msg_ = dMessage<false>|dMessage<true>|gMessage;
type pltfrm = "guilded"|"discord"|""|undefined|null;