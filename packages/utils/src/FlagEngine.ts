export { parseArgsStringToArgv };
export default function parseArgsStringToArgv(
  value: string,
  env?: string,
  file?: string
): string[] {
  // ([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*) Matches nested quotes until the first space outside of quotes

  // [^\s'"]+ or Match if not a space ' or "

  // (['"])([^\5]*?)\5 or Match "quoted text" without quotes
  // `\3` and `\5` are a backreference to the quote style (' or ") captured
  const myRegexp = /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;
  const myString = value;
  const myArray: string[] = [];
  if (env) {
    myArray.push(env);
  }
  if (file) {
    myArray.push(file);
  }
  let match: RegExpExecArray | null;
  do {
    // Each call to exec returns the next regex match as an array
    match = myRegexp.exec(myString);
    if (match !== null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      myArray.push(firstString(match[1], match[6], match[0])!);
    }
  } while (match !== null);

  return myArray;
}

// Accepts any number of arguments, and returns the first one that is a string
// (even an empty string)
function firstString(...args: Array<any>): string | undefined {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string") {
      return arg;
    }
  }
}

const stringArgv = parseArgsStringToArgv

export class FlagEngine {
  public flags: string[] = []
  public prefix: string = ""
  public lastParsed: string = ""
  constructor(flagPrefix: string, passedFlags: string[]) {
    this.prefix = flagPrefix
    this.flags = passedFlags;
  }
  public parse(msg: string) {
    const argv = stringArgv(msg, 'node', 'ebolean')
    const parsed: any[] = []
    argv.forEach((flag: string, index: number) => {
      if (flag.startsWith(this.prefix))
        return parsed.push(flag.replace(this.prefix, ''));
      else return;
    })
    return parsed
  }
  public getFlag(flagName: string, msg: string) {
    const parsed = this.parse(msg)
    let flag;

    parsed.forEach((flag: string) => {
      const flg = flag.split("=");
      flg[1] = JSON.parse(flg[1])
      if (flg[0] == flagName) {
        //console.log(flg, flg[0], "==", flagName, (flg[0] == flagName), flg[1])
        this.lastParsed = flg[1]
        // console.log(this.lastParsed)
      }
      else return flag = "NONE"
    })

    return { parsed, value: this.lastParsed }
  }
}
