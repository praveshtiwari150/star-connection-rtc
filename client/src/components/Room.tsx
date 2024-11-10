import { useParams } from "react-router-dom";
import { useHost } from "../context/HostProvider";
import { useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { BsMicMuteFill } from "react-icons/bs";
import {
  HiOutlineVideoCamera,
  HiOutlineVideoCameraSlash,
} from "react-icons/hi2";
import VideoOff from "./VideoOff";

const Room = () => {
  const params = useParams();
  const { sessionID } = params;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [videoConfig, setVideoConfig] = useState({
    video: true,
    audio: false,
  });

  const { sessionId, email, hostws, hostPC, setHostPC } = useHost();
  console.log("Room email: ", email);
  console.log("sessionID: ", sessionId);

  useEffect(() => {
    if (!hostPC) {
      setHostPC(new RTCPeerConnection());
    }
  }, [hostPC, setHostPC]);

  const startMeeting = async () => {
    if (!hostPC || !hostws) return;

    hostPC.onnegotiationneeded = async () => {
      try {
        alert("Offer initiated");
        const offer = await hostPC.createOffer();
        await hostPC.setLocalDescription(offer);
        hostws.send(
          JSON.stringify({ type: "offer", sdp: hostPC.localDescription })
        );
      } catch (err) {
        console.log("Error during negotiation: ", err);
      }
    };

    await sendStream();
  };

  const getCameraStream = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia(
        videoConfig
      );
      setStream(userMediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userMediaStream;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendStream = async () => {
    try {
      if (!stream || !hostPC) return;
      stream.getTracks().forEach((track) => {
        hostPC.addTrack(track, stream);
      });
    } catch (err) {
      console.log("Error while sending stream", err);
    }
  };

  useEffect(() => {
    getCameraStream();
  }, [videoConfig]);

  const copy = async () => {
    if (!sessionID) return;
    await navigator.clipboard.writeText(sessionID);
  };

  const truncatedSessionId = (sessionId: string) => {
    return sessionId.length > 4 ? `${sessionId.substring(0, 4)}...` : sessionId;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-[100vh]">
      <div className="w-[480px] h-96 rounded-lg border-2 border-cobalt-4 flex justify-center items-center">
        {videoConfig.video ? (
          <video
            className="min-w-[480px] bg-cover rounded-lg h-[350px]"
            ref={videoRef}
            autoPlay
            playsInline
          />
        ) : (
          email && (
            <VideoOff
              className="bg-rose-600 size-24 rounded-full flex flex-col justify-center items-center text-6xl font-bold text-pretty text-center"
              email={email}
            />
          )
        )}
      </div>
      <div className="flex gap-4 items-center rounded-lg">
        <input
          onClick={copy}
          type="button"
          value={truncatedSessionId(sessionID!)}
          className="bg-cobalt-1 w-[126px] text-charcoal-6 px-4 py-2 rounded-lg hover:bg-cobalt-4 cursor-pointer hover:text-cobalt-1"
        />
        <button
          onClick={() => {
            setVideoConfig((prev) => ({ ...prev, audio: !prev.audio }));
          }}
          className={`bg-cobalt-4 p-4 rounded-full ${
            videoConfig.audio ? "hover:bg-red-500" : "hover:bg-green-500"
          }`}
        >
          {videoConfig.audio ? (
            <AiFillAudio className="text-2xl" />
          ) : (
            <BsMicMuteFill className="text-2xl" />
          )}
        </button>
        <button
          className={`bg-cobalt-4 p-4 rounded-full ${
            videoConfig.video ? "hover:bg-red-500" : "hover:bg-green-500"
          }`}
          onClick={() => {
            setVideoConfig((prev) => ({ ...prev, video: !prev.video }));
          }}
        >
          {videoConfig.video ? (
            <HiOutlineVideoCamera className="text-2xl" />
          ) : (
            <HiOutlineVideoCameraSlash className="text-2xl" />
          )}
        </button>
        <button
          onClick={startMeeting}
          className="bg-cobalt-4 p-2 rounded-lg hover:bg-inidgo-6"
        >
          Start Meeting
        </button>
      </div>
    </div>
  );
};

export default Room;