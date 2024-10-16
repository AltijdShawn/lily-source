export function optsExamp(type: "required" | "optional", input: string | string[]) {
  const isOptType: boolean = !Array.isArray(input);
  let inner_interm = [];
  let inner = "";

  if (isOptType) inner = <any>input;
  else {
    for (const i of input) {
      inner_interm.push(`"${i}"`);
    }
    inner = inner_interm.join("|");
  }

  return type == "required" ? `<${inner}>` : `[${inner}]`;
}