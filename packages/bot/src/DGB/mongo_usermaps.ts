import { db } from "../framework";
import { removeFromArray, getFromArray } from "@daydrm-studios/chatbot-utils";

const table = async () => await db.get("profiles");

export async function init() {
  if (!(await db.has("profiles")))
    await db.set("profiles", [
      { prof_id: "", discord: "", guilded: "", total_xp: 0, level_xp: 0, level: 0, description: "" },
    ]);
}

export async function getData(platform, platId) {
  const map = await findMap(platform, platId);
  console.log("Map:", map);
  if (map == 0) return null;
  else {
    const mapObj = (await table())[map];
    return mapObj;
  }
}

export async function setData(profileID, object): Promise<boolean | null> {
  const map = await findMap("prof_id", profileID);
  // if (map == 0) return null;
  // const mapObj = (await table())[map]
  // if(map!=0) await db.set("profiles", removeFromArray((await table() as any[]), mapObj))
  // mapObj[platform] = platformID
  await db.push("profiles", object);
  return true;
}

export async function deleteData(profileID): Promise<boolean | null> {
  const map = await findMap("prof_id", profileID);
  if (map == 0) return null;
  const mapObj = (await table())[map];
  if (map != 0)
    await db.set("profiles", removeFromArray((await table()) as any[], mapObj));
  return true;
}

export async function setMap(
  profileID,
  platform,
  platformID
): Promise<boolean | null> {
  const map = await findMap("prof_id", profileID);
  if (map == 0) return null;
  const mapObj = (await table())[map];
  if (map != 0)
    await db.set("profiles", removeFromArray((await table()) as any[], mapObj));
  mapObj[platform] = platformID;
  await db.push("profiles", mapObj);
  return true;
}

export async function findMap(client, id) {
  let Target = 0;
  ((await table()) as unknown as any[]).forEach((item, index) => {
    if (item[client] == id) return (Target = index);
    else return;
  });
  return Target;
}

/**
 * >>ucfg profile create
 * (returns) profile created on id of (id)
 * >>ucfg profile addclient (platform) (platform id) (profile id)
 */
