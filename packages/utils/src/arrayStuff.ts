export function removeFromArray(Arr: any[], Str: any): any[] {
    let WorkFlow;
    WorkFlow = Arr.join(",");
    WorkFlow = WorkFlow.replace(","+Str, "");
    WorkFlow = WorkFlow.split(",");
    return WorkFlow
}
export function getFromArray(Arr: any[], ID: number): any {
  let temp_1;

  Arr.forEach((item, index) => {
    item.index = index
    if (item.ID == ID) return temp_1 = item;
    else return;
  })

  return temp_1
}