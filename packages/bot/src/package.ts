// MIRROR OF PACKAGE.JSON
export const pkg = {
  "name": "@daydrm-studios/chatbot-bot",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "license": "MIT",
  "private": true,
  "dependencies": {
    "axios": "^1.6.8",
    "bullmq": "^5.7.1",
    "discord.js": "^14.14.1",
    "guilded.js": "^0.24.1",
    "ioredis": "^5.4.0",
    "quickmongo": "^5.2.0",
    "redis": "^4.6.13",
    "socket.io-client": "^4.7.5",
    "turndown": "^7.1.3",
    "@daydrm-studios/chatbot-config": "file:../config",
    "@daydrm-studios/chatbot-utils": "file:../utils"
  },
  "devDependencies": {
    "@types/turndown": "^5.0.4",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}

  