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
    exports.WinkDiceConfig = void 0;
    exports.WinkDiceConfig = {
        username: "<BOT ACCOUNT USER NAME ON WINKDICE>",
        token: "<BOT ACCOUNT USER NAME ON WINKDICE>",
        assignedDMS: ["<THIS ARRAY IS A LIST OF BOT ADMINS>"],
        prefix: "/",
        socketIOEndpoint: "ws://127.0.0.1:3000", // by default we set this to local host but you can change it if needed
        REST_API_Endpoint: "http://127.0.0.1:3000", // by default we set this to local host but you can change it if needed
        PROD_REST_API_Endpoint: "<PRODUCTION URL ENDPOINT>"
    };
});
//# sourceMappingURL=winkdiceConf.js.map