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

function parseStr(str_: string, prefix = "--") {
  const splitArgs = str_.split(" ");
  let indexes: { flagnum: number; index: number }[] = [];
  let flagCount = 0;

  let parsed = [];
  let meta = {};

  splitArgs.forEach((val: string, index) => {
    if (val.startsWith(prefix)) {
      indexes.push({ flagnum: flagCount, index });
      flagCount++;
      // val.replace(prefix, "")
    }
  });

  for (const i of indexes) {
    const start = i.index;
    const end = indexes[i.flagnum + 1]
      ? indexes[i.flagnum + 1].index
      : splitArgs.length;
    meta[i.flagnum + "_start"] = start;
    meta[i.flagnum + "_end"] = end;
    parsed.push(splitArgs.slice(start, end).join(" "));
  }

  // return JSON.stringify({ meta, parsed });
  return parsed
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
    // const argv = stringArgv(msg, 'node', 'ebolean')
    const argv = parseStr(msg, this.prefix)
    const parsed: any[] = []
    argv.forEach((flag: string, index: number) => {
      if (flag.startsWith(this.prefix))
        return parsed.push(flag.replace(this.prefix, ''));
      else return;
    })
    return parsed
  }
  public getFlag(flagName: string, msg: string, parseAsString = true) {
    const parsed = this.parse(msg)
    let flag;
    let _values_ = {}

    let match = ''

    // parsed.forEach((flag: string) => {
    //   const flg = flag.split("=");
    //   _values_[flg[0]] = flg[1]
    //   if(!parseAsString) flg[1] = JSON.parse(flg[1])
    //   if (flg[0] == flagName) {
    //     //console.log(flg, flg[0], "==", flagName, (flg[0] == flagName), flg[1])
    //     this.lastParsed = flg[1]
    //     // console.log(this.lastParsed)
    //   }
    //   else this.lastParsed = ''
    // })
    for (const query_ of parsed) {
      const keyval = query_.split("=");
      const [key, val] = keyval;
      _values_[key] = val;
      if (flagName == key) match = val
    }

    console.log(_values_)
    return { parsed, value: match, _values_ }
  }
}
