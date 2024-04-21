# CyBR Lily bot `(source)`

> [!NOTE]
> **CyBR** is a sub division of **Helix**
> Which is a sub division of **DayDRM Studios**
> Which is Owned by **DayDRM** & **Aimzz**

For the main production build go [[HERE]](https://github.com/project-helix/lily-production)

---

Lily is a cross platform multi purpose chat bot.
Platforms include:
- Discord
- Guilded
- Winkdice (Our own social media platform) - (WARNING: This service is currently not running because we lack server space, but most functions should work) - (you could host your own instance with the [source code](https://github.com/project-helix/WinkDice))


---
### File Structure
```md
+ chatBot
| +---[packages]          | This folder contains the source code
| | ----[bot]             | This sub folder contains the main source files of the bot
| | ----[config]          | This sub folder contains the config files and some utils to parse them
| | ----[utils]           | This sub folder contains useful utilities that may also be usefulf or other projects
| ----[publish-templates] | This folder contains the config templates used by the build scripts
| ----[scripts/build]     | This folder contains the build scripts
| ----.gitignore          | This file tells git what to ignore
| ----package.json        | This file is the root package file
| ----yarn.lock           | This is the root package lock file
```
---
### Prerequisites
* **Node.JS** Version `>=18.x.x`
* A local **MongoDB** instance
    - Install instructions:
        - Either google it for OS specific instructions
        - Or follow a linux distro independent tutorial [[HERE]](https://www.digitalocean.com/community/tutorials/install-mongodb-linux)
* A `Redis` (or `valkey`) instance
    - Also for this just google how to install though i recommend `valkey` over `Redis` but both should be 100% compatible with eachother
* and finally make sure that `corepack` is installed and enabled
    - (If `Node.JS` is installed just type `corepack enable` in your command line (You may need to put sudo in front of it if it fails, but it shouldn't))
---
### installation, build, configure and run (Linux/WSL2)
1. in `packages/config` fill out the following files:
    - `winkdiceConf.ts` (optional since defaults are set to our host and that's completely fine)
    - `chatbots/tokens.ts` (required since.. well the bots need tokens)
    - `chatbots/client.ts` (required since the bots need to know who they are)
    - `chatbots/maps.ts` (optional since the bot ignores that if it isn't filled out)
2. in the root folder run `yarn run build` (WARNING: It absolutely has to be yarn)
    - this will automatically install the dependencies needed
3. Make sure you have a local `MongoDB` and a local `Redis`/`valkey` Instance running
4. to run the bot you have a few options
    1. in the root folder run `yarn run start`
    1. in the root folder run `yarn run start`
    3. in the `packages/bot` folder run `node .`