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
    exports.channelmap = void 0;
    exports.channelmap = [
        // No ChannelMap
        {
            /* EXAMPLE MAP */
            //
            discord: "",
            guilded: "",
        },
    ];
    // the above array contains channel ids for channels you want to link together
    // discord = discord channel id
    // guilded = guilded channel id
});
//# sourceMappingURL=maps.js.map