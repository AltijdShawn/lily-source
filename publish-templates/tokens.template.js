(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokens = void 0;
    exports.tokens = {
        guilded_bot_token:
            "<GUILDED BOT TOKEN>",
        discord_bot_token:
            "<DISCORD BOT TOKEN>",
        prefix: ">>"
    };
});
//# sourceMappingURL=tokens.js.map