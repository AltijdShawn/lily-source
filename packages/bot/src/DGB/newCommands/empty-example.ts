import { CmdBaseClass, CmdClass } from "../../constructors/DGB/cmd_class";
import { _Extra, msg_, pltfrm } from "../../types/DGB/command";

export default class extends CmdBaseClass implements CmdClass {
  public name = ""
  public aliases = []

  public execute() {
    this.cmdClient.reply("8===>")
  };
}

export class EXAMPLE extends CmdBaseClass implements CmdClass {
  public name = ""
  public aliases = []
  constructor(
    msg: msg_, 
    args: string[], 
    cmd: string, 
    platform: pltfrm, 
    extra: _Extra
  ) {
    super(msg,args,cmd,platform,extra)
  }

  public execute() {
    this.cmdClient.reply("8===>")
  };
}