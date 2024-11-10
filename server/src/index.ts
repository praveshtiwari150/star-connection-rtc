import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuid } from 'uuid';
import { WebSocket, WebSocketServer } from "ws";
dotenv.config()
const PORT = process.env.PORT

interface User{
    email: string;
    // type: "guest" | "host";
    ws: WebSocket
}

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));

const server = app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

const emailToSessionId = new Map();
const sessionIdToUsers: Map<string, User[]> = new Map();


let host: WebSocket | null = null;

wss.on('connection', (ws) => {
    ws.on('error', console.error);
    
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());

        switch (message.type) {
            case 'create-meeting':
                if (emailToSessionId.has(message.email)) {
                    console.log('meeting exists');
                    console.log('Host: ', message.email, 'sessionID: ', emailToSessionId.get(message.email))
                    ws.send(JSON.stringify({ type: 'meeting-exists', email: message.email,sessionID: emailToSessionId.get(message.email) }));
                    break;
                }

                handleCreateMeeting(ws, message);
                break;
            
            case 'offer':
                if (ws !== host) return;
                
        }
    });
});

function handleCreateMeeting(ws:WebSocket, message:any) {
    const { email } = message;
    const sessionID = uuid();
    emailToSessionId.set(email, sessionID);
    host = ws;
    console.log('meeting created');
    console.log('Host: ', message.email, 'sessionID: ', sessionID);
    ws.send(JSON.stringify({ type: 'meeting-created', email, sessionID }));
}