import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuid } from 'uuid';
import { WebSocket, WebSocketServer } from "ws";
dotenv.config()
const PORT = process.env.PORT

interface Peers{
    email: string;
    ws: WebSocket
}

interface Session{
    sessionId: string;
    meetingStarted: boolean;
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

const emailToSessionId:Map<string, Session> = new Map();
const sessionHosts = new Map<string, WebSocket>();
let peers: Map<string, Peers[]> = new Map(); 

wss.on('connection', (ws) => {
    ws.on('error', console.error);
    
    
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case 'create-meeting':
                if (emailToSessionId.has(message.email)) {
                    const session = emailToSessionId.get(message.email);
                    console.log('meeting exists');
                    console.log('Host: ', message.email, 'sessionID: ', emailToSessionId.get(message.email))
                    ws.send(JSON.stringify({ type: 'meeting-exists', email: message.email,sessionId: session?.sessionId }));
                    break;
                }

                handleCreateMeeting(ws, message);
                break;
            
            case 'start-meeting':
                handleStartMeeting(ws, message)
                break;

            case 'join-meeting':
                handleJoinMeeting(ws, message);
                break;
            
            case 'join-request-accepted':
                handleJoinRequestAccepted(ws, message)
                break;


            case 'offer':
                forwardMessageToPeer(message);
                break;
            
            case 'answer':
                forwardMessageToPeer(message);
                break;
            
            case 'ice-candidate':
                forwardMessageToPeer(message);
                break;
        }
    });

    ws.on('close', () => {
        peers.forEach((peerList, sessionId) => {
            const updatedPeers = peerList.filter(p => p.ws !== ws);
            if (updatedPeers.length) {
                peers.set(sessionId, updatedPeers);
            }

            else {
                peers.delete(sessionId);
            }
        })
    })
});

function handleCreateMeeting(ws:WebSocket, message:any) {
    const { email } = message;
    const sessionId = uuid();
    emailToSessionId.set(email, {sessionId, meetingStarted:false});
    sessionHosts.set(sessionId, ws);
    console.log("Meeting created, Session ID: ", sessionId);
    console.log("Session Hosts Map: ", Array.from(sessionHosts.entries()));
    ws.send(JSON.stringify({ type: 'meeting-created', email, sessionId }));
}

function handleStartMeeting(ws: WebSocket, message: any) {
    const { email, sessionId } = message;
    const session = emailToSessionId.get(email);

    if (!session) {
        ws.send(JSON.stringify({ type: 'invalid-session' }));
        return;
    }

    session.meetingStarted = true;
    sessionHosts.get(sessionId)?.send(JSON.stringify({ type: 'meeting-started' }));
    console.log('Meeting started for session: ', sessionId);
}

function handleJoinMeeting(ws: WebSocket, message: any) {
    const { email, sessionId } = message;
    console.log(`Peer ${email} is trying to join session ${sessionId}`);

    const session = Array.from(emailToSessionId.values())
        .find(s => s.sessionId === sessionId);

    if (!session) {
        console.log("Invalid session ID");
        ws.send(JSON.stringify({ type: 'invalid-sessionid' }));
        return;
    }

    if (!session.meetingStarted) {
        console.log("Meeting has not started yet");
        ws.send(JSON.stringify({ type: 'meeting-not-started' }));
        return;
    }

    let peersList = peers.get(sessionId) || [];
    peersList.push({ email, ws });
    peers.set(sessionId, peersList);

    sessionHosts.get(sessionId)?.send(JSON.stringify({ type: 'join-request', email }));
}

function handleJoinRequestAccepted(ws: WebSocket, message: any){
    const { sessionId, peerEmail } = message;

    console.log("Received Join Request acceptance: ", message);
    // Check if sessionId exists
    if (!sessionId) {
        console.log("Error: sessionId is undefined in the message");
        return;
    }
    const hostws = sessionHosts.get(sessionId);
    console.log("Current ws: ", ws);
    console.log("Host ws: ", hostws)
    console.log("Session Id:", sessionId);
    console.log("Session Hosts Map: ", Array.from(sessionHosts.entries()));
    if (ws !== hostws) {
        console.log("Only host can send accept join requests");
        return;
    }

    const peersList = peers.get(sessionId);
    const peer = peersList?.find(p => p.email === peerEmail)

    if (peer) {
        console.log(`Join request for ${peer.email} accepted`)
        peer.ws.send(JSON.stringify({ type: 'join-request-accepted' }));
    }

    else {
        console.log(`Peer ${peerEmail} not found in session ${sessionId}`);
    }
}

function forwardMessageToPeer(message: any) {
    const { email, type, sdp, candidate } = message;

    const peersList = peers.get(message.sessionId)

    if (peersList) {
        const peer = peersList.find(p => p.email === email);
        if (peer) {
            peer.ws.send(JSON.stringify(type, sdp, candidate));
        }
    }
}