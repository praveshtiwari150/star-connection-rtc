import { useState, useEffect } from "react";
import { useHost } from "../context/HostProvider";
import { useNavigate } from "react-router-dom";

const JoinMeeting = () => {
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const { hostws } = useHost();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hostws) return;

    hostws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'offer':
          handleOffer(message);
          break;
        case 'ice-candidate':
          handleIceCandidate(message);
          break;
        
        case 'join-request-accepted':
          alert("Join request accepted")
      }
    }

    hostws.onclose = () => {
      console.log("WebSocket connection cloesed.");
    }
  }, [hostws, sessionId]);

  const handleJoinMeeting = (event: any) => {
    event.preventDefault();

    if (!hostws) return;

    console.log(hostws);
    if (hostws.readyState === WebSocket.OPEN) {
      console.log("inside ready state");
      hostws.send(JSON.stringify({ type: "join-meeting", email, sessionId }));
    }
    
  }

  const handleOffer = async (message: any) => {
    const pc = new RTCPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    hostws?.send(JSON.stringify({type: "answer", sdp:pc.localDescription, email}))
  }

  const handleIceCandidate = async (message: any) => {
    const pc = new RTCPeerConnection();
    await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    navigate(`/room/${sessionId}`);
  };
  return (
    <div className="flex flex-col h-[250px] border border-cobalt-4 p-8 rounded-xl gap-4 justify-center items-center">
      <form
        className="flex flex-col gap-4 justify-center items-end"
        onSubmit={handleJoinMeeting}
      >
        <div className="flex gap-2">
          <label htmlFor="">Email</label>
          <input
            onChange={(event: any) => setEmail(event?.target.value)}
            type="text"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="">Session Id</label>
          <input
            onChange={(event: any) => setSessionId(event?.target.value)}
            type="text"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
        </div>
        <button
          type="submit"
          className="bg-cobalt-4 w-full p-2 rounded-lg hover:bg-inidgo-6"
        >
          Join Meeting
        </button>
      </form>
    </div>
  );
}

export default JoinMeeting
