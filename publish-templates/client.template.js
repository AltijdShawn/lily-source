(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./tokens", "discord.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.client = void 0;
    const tokens_1 = require("./tokens");
    const discord_js_1 = require("discord.js");
    exports.client = {
        clientId: "<DISCORD BOT CLIENT ID>",
        privilegedUsers: ["<THIS LIST CONTAINS BOTH DISCORD AND GUILDED USER IDS FOR ADMINS>"],
        prefix: tokens_1.tokens.prefix,
        intents: [discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildMembers],
        guilds: {
          Discord: "<DISCORD SERVER INVITE LINK>",
          Guilded: "<GUILDED SERVER INVITE LINK>"
        }
      };
});
//# sourceMappingURL=client.js.map