import {
  v2 as framework,
  Command,
  v2_T,
  v2,
  config_,
  Message,
} from "./framework";
import {
  Message as dMessage,
  Collection,
  Client,
  Events,
  SlashCommandBuilder,
  CommandInteraction,
  InteractionResponse,
  REST,
  Routes,
  GatewayIntentBits as GW,
} from "discord.js";
import { Database } from "quickmongo";
import { DGB } from "./DGB";
import { WinkDiceConfig as conf } from "@daydrm-studios/chatbot-config";
import { basicStores } from "./stores/basic-stores";

let stateHolder = {
  spam: false,
  spamExtraFunc: (state) => {},
  count: {
    Onesec: 0,
  },
};

const store = basicStores

store.counters.set("uptime", 0);


async function loop() {
  try {
    // Own webSite Bot API bot
    const config: config_ | any = conf;

    const cmds: Command[] = [
      {
        name: "nothing",
        restrict: ["none"],
        execute: (msg, fw) => {},
      },
      {
        name: "send",
        restrict: ["xA_Emiloetjex"],
        execute: (msg, fw: v2_T) => {
          // console.log(msg);
          fw.sendWS({
            id: "sendAimedMesg",
            args: {
              target: "global",
              message: {
                text: `${msg.args.join(" ")}`,
                position: "top-right",
                pauseOnHover: true,
                pauseOnFocusLoss: true,
              },
            },
          });
        },
      },
      {
        name: "overload",
        restrict: ["xA_Emiloetjex"],
        execute: (msg, fw: v2_T) => {
          // console.log(msg);
          ToggleSpam(msg, fw);
        },
      },
      {
        name: "popup",
        restrict: ["xA_Emiloetjex"],
        execute: (msg, fw: v2_T) => {
          // console.log(msg);
          fw.sendWS({
            id: "modal",
            args: {
              title: "",
              content: `<header style="color:var(--theme-fg)">${msg.args.join(
                " "
              )}</header>`,
              targets: ["global"],
            },
          });
        },
      },
      {
        name: "serverCMD",
        restrict: ["xA_Emiloetjex"],
        execute: (msg, fw: v2_T) => {
          // console.log(msg);
          fw.sendWS({
            id: "notification_send",
            args: {
              msg: `@${msg.args[0]} ${msg.args
                .slice(1, msg.args.length)
                .join(" ")}`,
              data: {
                authToken: config.token,
                target: "main",
                sender: config.username,
                content: msg.content,
                meta: {
                  sessionId: "000000",
                },
              },
            },
          });
        },
      },
    ];

    const events = {
      onMessageCreate: (ev, extra) => {
        const { msg } = extra;
      },
    };

    const fw_: v2_T | any = new framework(config, cmds, events);

    // Discord Bot / (New) DBG

    DGB(fw_, config, {
      makeid,
      ToggleSpam,
      stateHolder,
    });

    // Extra Stuff

    setInterval(() => {
      if (stateHolder.spam == false) return;
      const arr = [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ];
      const rand = Math.floor(Math.random() * arr.length);
      const pos = arr[rand];
      stateHolder.spamExtraFunc(stateHolder.spam);
      fw_.sendWS({
        id: "sendAimedMesg",
        args: {
          target: "global",
          message: {
            text: `<button>${makeid(Math.round(Math.random() * 64) + rand)}</button>`,
            position: pos,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
          },
        },
      });
    }, 200);
    setInterval(async () => {
      store.counters.set("uptime", (store.counters.get("uptime") as number)+1);
    }, 1000);
  } catch (e) {
    console.log(e);
    const config: config_ | any = conf;
    new framework(config, [], []).reportIncident("error", e, {
      file: "src/index.ts",
      timestamp: Date.now()
    });
    loop();
  }
}
loop();

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function ToggleSpam(msg: Message, fw: v2_T, extraFunc?: () => any) {
  if (stateHolder.spam == false) {
    stateHolder.spam = true;
    extraFunc != undefined
      ? (stateHolder.spamExtraFunc = extraFunc)
      : (stateHolder.spamExtraFunc = (state) => {});
  } else if (stateHolder.spam == true) {
    stateHolder.spam = false;
    stateHolder.spamExtraFunc = (state) => {};
  }

  fw.sendMessage({
    target: msg.target,
    content: `Spam loop is set to ${stateHolder.spam}`,
  });

  return stateHolder;
}