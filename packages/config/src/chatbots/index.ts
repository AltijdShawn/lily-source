import { client } from "./client";
import { tokens } from "./tokens";
import { channelmap } from "./maps";

const cfg = {
    client,
    ...tokens,
    channelmap
}

export const chatbotsConfig = cfg;
export function findMap(client, id) {
    let Target = 0;
    cfg.channelmap.forEach((item, index) => {
        if (item[client] == id) return (Target = index);
        else return;
    });
    return Target;
}
