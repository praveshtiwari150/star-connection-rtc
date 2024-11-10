"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const ws_1 = require("ws");
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL
}));
const server = app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
const wss = new ws_1.WebSocketServer({ server });
const emailToSessionId = new Map();
const sessionIdToUsers = new Map();
let host = null;
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case 'create-meeting':
                if (emailToSessionId.has(message.email)) {
                    console.log('meeting exists');
                    console.log('Host: ', message.email, 'sessionID: ', emailToSessionId.get(message.email));
                    ws.send(JSON.stringify({ type: 'meeting-exists', email: message.email, sessionID: emailToSessionId.get(message.email) }));
                    break;
                }
                handleCreateMeeting(ws, message);
                break;
            case 'offer':
                console.log('Offer invoked');
        }
    });
});
function handleCreateMeeting(ws, message) {
    const { email } = message;
    const sessionID = (0, uuid_1.v4)();
    emailToSessionId.set(email, sessionID);
    host = ws;
    console.log('meeting created');
    console.log('Host: ', message.email, 'sessionID: ', sessionID);
    ws.send(JSON.stringify({ type: 'meeting-created', email, sessionID }));
}
