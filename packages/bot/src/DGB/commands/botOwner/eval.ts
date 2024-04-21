import { Cmd } from "../../../CmdClient";
import { secondsToString as tFormat, removeFromArray, getFromArray  } from "@daydrm-studios/chatbot-utils";
import { basicStores } from "../../../stores/basic-stores";
import { DGB_CMD } from "../../../types/DGB/command";
import { discConfig } from "../..";
import { deleteData, getData, setData, setMap } from "../../mongo_usermaps";
import axios from "axios";

const store = basicStores;

const cmd: DGB_CMD = {
  name: "eval",
  aliases: ["exec", "execute", "evaluate"],
  execute: async (msg, args, cmd, platform, extra) => {
    const { fw_, config, fnv } = extra;
    const _ = Cmd({ msg, args, cmd }, platform);
    const client = _.msg.msg.client;
    const ax = axios
    const delData = deleteData
    const sData = setData
    const gData = getData
    const sMap = setMap
    const timeFormat = tFormat
    const rFA = removeFromArray
    const gFA = getFromArray

    let enableEvalOutput = true;

    function blockOutput() {return}

    const mesg = args.slice(1, args.length);
    if (!discConfig.privilegedUsers.includes(msg.author.id))
      return msg.reply("You are not privileged to use this command");
    else {
        try {
            const codeExec = async (c) => await eval(c)
            const code = args.splice(1, args.length).join(" ");

            if (code.startsWith("blockOutput()")) enableEvalOutput = false

            if (code.length && code.length > 1) return execute()
            else throw new Error("code is too short!");

            async function execute() {
                if (enableEvalOutput == false) {
                    return await codeExec(code)
                } else return msg.reply({
                    embeds: [
                        (new _.Embed()
                            .setTitle("Eval")
                            .setColor(0xaaFF33)
                            .setDescription(
                                `\`\`\`js\r\n\r${await codeExec(code)}\r\n\r\`\`\``
                        ) as any)
                    ]
                })
            }
        } catch (e) {
            msg.reply({
                embeds: [
                    (new _.Embed()
                        .setTitle("Eval")
                        .setColor(0xFF3333)
                        .setDescription(
                            `\`\`\`js\r\n\r${Process(e)}\r\n\r\`\`\``
                    ) as any)
                ]
            })

            function Process(e_: Error|any) {
                let name = ""
                let msg  = ""
                let errors = [""]
                let returns = ""
                if(e_.message) msg = e_.message
                if(e_.name) name = e_.name
                if(e_.errors) errors = e_.errors

                returns = `${name}: ${msg}\n${errors}`

                if((!e_.message)&&(!e_.name)&&(!e_.errors)) returns = e_

                return returns
            }
        }
    }
  },
};
export default cmd;