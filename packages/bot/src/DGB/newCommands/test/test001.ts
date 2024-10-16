import { CmdBaseClass2, CmdClass2 } from "../../../constructors/DGB/cmd_class";
import { _Extra } from "../../../types/DGB/command";

export default class extends CmdBaseClass2 implements CmdClass2 {
  public name = "test001"
  public aliases = []

  public run() {
    this.cmdClient.reply(`platform == ${this.platform}`)
  };


}