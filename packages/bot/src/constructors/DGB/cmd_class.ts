import { Client as DClient } from "discord.js";
import { Client as GClient } from "guilded.js";

import { config_, v2_T } from "../../framework";
import { _Extra, msg_, pltfrm } from "../../types/DGB/command";
import { Cmd, msgObj, cmdRet } from "../../CmdClient";

type TCmdClient = (m: msgObj, platform?: pltfrm) => cmdRet

export interface CmdClass extends CmdBase {
  name: string;
  aliases: string[];
  execute: () => void
}

export interface CmdClass2 extends CmdBase2 {
  name: string;
  aliases: string[];
  run: () => void
}

export interface CmdBase {
  readonly msg: msg_, 
  readonly args: string[], 
  readonly cmd: string, 
  readonly platform: pltfrm, 
  readonly extra: _Extra
  //* protected // cmdClient : cmdRet
  //* protected // client    : DClient | GClient
}

export interface CmdBase2 {
  // readonly msg: msg_, 
  // readonly args: string[], 
  // readonly cmd: string, 
  // readonly platform: pltfrm, 
  // readonly extra: _Extra
  //* protected // cmdClient : cmdRet
  //* protected // client    : DClient | GClient
}

export class CmdBaseClass {
  // private extra     : _Extra
  protected cmdClient : cmdRet
  protected client    : DClient | GClient

  constructor(
    readonly msg: msg_, 
    readonly args: string[], 
    readonly cmd: string, 
    readonly platform: pltfrm, 
    readonly extra: _Extra) {
    this.cmdClient = Cmd({msg,args,cmd}, platform)
    this.client = this.cmdClient.msg.msg.client
  }
}


export abstract class CmdBaseClass2 {
  // private extra     : _Extra
  protected cmdClient : cmdRet
  protected client    : DClient | GClient
  protected msg       : msg_
  protected args      : string[]
  protected cmd       : string
  protected platform  : pltfrm
  protected extra     : _Extra
  protected mesg      : msg_

  constructor() {}

  /**
   * The execution call,
   * It constructs all the variables,
   * 
   * Then it executes the `run()` method
   */
  execute(
    msg: msg_, 
    args: string[], 
    cmd: string, 
    platform: pltfrm, 
    extra: _Extra) {
    this.msg        = msg       
    this.args       = args      
    this.cmd        = cmd       
    this.platform   = platform  
    this.extra      = extra     
    this.cmdClient  = Cmd({msg,args,cmd}, platform)
    this.client     = this.cmdClient.msg.msg.client
    this.mesg       = this.cmdClient.msg.msg

    this.run()
  }

  /**
   * The `run()` method, executed by the `execute()` method.
   * 
   * ---
   * 
   * The `execute()` method is defined in the parent class,
   * 
   * and is called upon by the bot, the method defines the internal variables passed in by the bot.
   *
   * ---
   *
   * The `run()` method should be the one you define
   */
  abstract run()
}
