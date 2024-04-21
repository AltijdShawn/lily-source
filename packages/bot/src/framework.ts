import axios from "axios";
import { Collection } from "discord.js";
import { io } from "socket.io-client";

import { Database } from "quickmongo";

import { init as initProfiles } from "./DGB/mongo_usermaps";

import { Queue, Worker, QueueEvents } from "bullmq";

export const queueNames = {
  msgCache: "DGB_Lily_MsgCache",
};

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const msgQueue = new Queue(queueNames.msgCache, { connection });
let useMessageQueue: boolean = true;

export const db = new Database("mongodb://127.0.0.1:27017/testBot");
db_connect()
  .then(() => console.info("Database connected"))
  .catch((err) => console.error(err));

// const db = new QuickDB({ driver });

async function db_connect() {
  // await mongoose.connect(config.uri)
  await db.connect();

  initProfiles();
}

export class v2 {
  public database = db;
  socket;
  commands = new Collection();
  events = new Collection();
  public config: config_;
  private lastmsgid = 0;
  private intproc = {
    val: 0,
    cache: [],
  };

  constructor(config: config_, cmds: Command[], events: any) {
    this.config = config;
    cmds.forEach((cmd) => this.commands.set(cmd.name, cmd));
    // events.forEach((event) => this.commands.set(event.name, event));
    // this.config = config
    console.log(this.config);
    this.socket = io(this.config.socketIOEndpoint, {
      reconnectionDelayMax: 10000,
    });
    this.socket.on("inviteBot", (data) => this.onBotInvite(data));
    this.socket.on("newMessageOnChannel", async (data) => {
      console.log(await db.get("channels"));
      try {
        const arr: number[] = await db.get("channels");
        if (!arr.includes(data.msg.chatId)) return;
        // console.log(data);
        this.onMessageCreate(data);
      } catch (e) {
        void e;
      }
    });

    this.onReady();

    let msgQueue_worker;
    if (useMessageQueue == false) {
      msgQueue_worker = setInterval(() => {
        if (this.intproc.val == 0) return;
        else {
          const ip = this.intproc;

          this.cmdHandler(ip.cache[ip.cache.length - 1]);

          ip.cache.pop();
          ip.val--;

          return (this.intproc = ip);
        }
      }, 500);
    } else {
      msgQueue_worker = new Worker(
        queueNames.msgCache,
        async (job) => {
          console.info(`[WS_Queue Job]: ${job.id}`, job.data);
          this.cmdHandler(job.data);

          return (this.intproc.val -= 1);
        },
        { connection }
      );
    }
  }
  async addCache(stuff) {
    console.log(stuff);
    if (useMessageQueue == false) {
      this.intproc.cache.push(stuff);
      this.intproc.val++;
    } else {
      this.intproc.val++;
      await msgQueue.add(`msgQueue_msg_${this.intproc.val}`, stuff);
    }
    // console.log(this.intproc);
  }
  eventHandler(eventName: string, extra) {
    if (!this.events.has(eventName)) return;
    const event: any = this.events.get(eventName);
    // console.log({msg,cmd})

    event.execute(eventName, extra, this);
    // if ((cmd.restrict as unknown as string[]).includes(msg.sendBy)) return cmd.execute(msg, this);
    // else if ((cmd.restrict as unknown as string[]).includes("none")) cmd.execute(msg, this);
    // else return;
  }
  cmdHandler(msg) {
    if (!this.commands.has(msg.content.split(" ")[0])) return;
    const cmd: any = this.commands.get(msg.content.split(" ")[0]);
    // console.log({msg,cmd})
    if ((cmd.restrict as unknown as string[]).includes(msg.sendBy))
      return cmd.execute(msg, this);
    else if ((cmd.restrict as unknown as string[]).includes("none"))
      cmd.execute(msg, this);
    else return;
  }
  public async sendMessage(data) {
    await axios({
      method: "POST",
      url: this.config.REST_API_Endpoint + "/api/chat/send",
      data: {
        data: {
          authToken: this.config.token,

          target: data.target,
          sender: this.config.username,
          content: data.content,
        },
      },
    }).then((resp) => console.log(resp.data));
  }

  /**
   * @param {inviteBotShit} data
   */

  onMessageCreate(data) {
    let msg = data.msg;
    this.eventHandler("onMessageCreate", msg);
    if (String(msg.content).startsWith(this.config.prefix)) {
      if (msg.sender == this.config.username) return;
      if (msg.id == this.lastmsgid) return;

      msg.content = msg.content.replace(this.config.prefix, "");

      msg.cmd = msg.content.split(" ")[0];
      msg.args_meta = msg.content.split(" ");
      msg.args = msg.args_meta.slice(1, msg.args_meta.length);

      this.addCache(msg);

      console.log("[COMMAND]", data);

      return (this.lastmsgid = msg.id);
    }
  }

  async onBotInvite(data) {
    console.log(this);
    if (this.config.username == data.bot) {
      await db.push("channels", data.chat.id);
      this.sendMessage({
        target: data.chat.name,
        content: "Registered channel of name '" + data.chat.name + "'",
      });
    }
  }

  onReady() {
    this.sendWS({
      id: "sendAimedMesg",
      args: {
        target: "global",
        message: {
          text: `${this.config.username}, started successfully`,
          position: "top-right",
          pauseOnHover: true,
          pauseOnFocusLoss: true,
        },
      },
    });
  }

  public sendWS(data) {
    axios({
      method: "POST",
      url: this.config.REST_API_Endpoint + "/api/addWSCache",
      data: {
        data: {
          authToken: this.config.token,
          wsIn: data,
        },
      },
    }).then((resp) => {
      console.log(resp.data);
      return resp;
    });
  }

  public async reportIncident(level, message, data: IncidentReportData) {
    setTimeout(() => {
      this.sendWS({
        id: "incidentReport",
        args: {
          level,
          message: String(message),
          data: {
            file: data.file! ?? "unknown",
            userId:
              data.userId! ?? "<BOT-INSTANCE>::{" + this.config.username + "}",
            sessionId:
              data.sessionId! ??
              "<BOT-INSTANCE>::{" + this.config.username + "}",
            socketId: data.socketId! ?? "unknown",
            timestamp: data.timestamp! ?? Date.now(),
          },
        },
      });
    }, 2000);
  }
}

interface IncidentReportData {
  file?: string;
  userId?: string;
  sessionId?: string;
  socketId?: string;
  timestamp?: number; // Unix-Timestamp
}

export declare type v2_T = typeof v2 & v2;

export interface config_ {
  username: string;
  token: string;
  assignedDMS?: string[];
  prefix: string;
  socketIOEndpoint: string;
  REST_API_Endpoint: string;
}
export interface Command {
  name: string;
  restrict: string[];
  execute: (msg: any, fw: v2_T) => any | void;
}

export interface Message {
  chatId: number;
  sendBy: string;
  target: string | null;
  content: string;
  cmd: string;
  args_meta: string[];
  args: string[];
}
