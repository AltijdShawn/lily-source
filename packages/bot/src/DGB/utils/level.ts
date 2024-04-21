import { db } from "../../framework";
import { removeFromArray, getFromArray } from "@daydrm-studios/chatbot-utils";
import { getData, setMap, findMap } from "../mongo_usermaps";

import { 
    Message as dMessage, 
    EmbedBuilder as dEmbed, 
    User as dUser,
    Channel as dChannel,
    PermissionsBitField as PBF
  } from "discord.js"
  import { 
    Message as gMessage, 
    Embed as gEmbed,
    User as gUser,
    Channel as gChannel
  } from "guilded.js"

const server = undefined

const settings: {minXP:number,maxXP:number,pow:100} = server || {
    minXP: 1,
    maxXP: 15,
    pow: 100
}

export async function giveXP(msg, platform, amount?:number) {
    const authorId = (platform == "discord" ? msg.author.id : msg.authorId) || msg.author.id
    const exists = await getData(platform, authorId)
    if (exists == null) return;
    // const isTextChannel = platform == "discord" ? msg.channel.type == 0 : msg.channel.type == 1

    const minXP = settings.minXP;
    const maxXP = settings.maxXP;

    let gain = amount !== undefined ? minXP + Math.floor(Math.random() * (1 + maxXP - minXP)) : amount;

    const xpToAdd = gain

    await setMap(exists["prof_id"], "total_xp", Number(exists["total_xp"]) + xpToAdd)
    await setMap(exists["prof_id"], "level_xp", Number(exists["level_xp"]) + xpToAdd)

    await rewardIfGoalReached(exists, msg)
}

export async function rewardIfGoalReached(user, msg) {
    const user_ = await getData("prof_id", user["prof_id"])

    const nxtLvl = settings.pow * (Math.pow(2, user["level"]) - 1);
    if(user_["level_xp"] >= nxtLvl) {
        let reset_value = 0;
        if(user_["level_xp"] > nxtLvl) reset_value = Number(user["level_xp"]) - nxtLvl
        await setMap(user["prof_id"], "level_xp", reset_value)
        await setMap(user["prof_id"], "level", Number(user["level"]) + 1)

        const user__ = await getData("prof_id", user["prof_id"])
        const nxtLvl_ = settings.pow * (Math.pow(2, user__["level"]) - 1);

        msg.reply(`**Congratulations!**\nYou have reached level \`${user__["level"]}\`, your total XP is \`${user__["total_xp"]}\`, XP progress for the next level: \`${user__["level_xp"]}/${nxtLvl_}\`!`)
    }
    else return;
    
}