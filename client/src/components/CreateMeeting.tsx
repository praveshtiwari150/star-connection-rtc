import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHost } from "../context/HostProvider";

const CreateMeeting = () => {
  const navigate = useNavigate();
  const { sessionId, setSessionId, hostws, email, setEmail } = useHost();

  const createMeeting = (event: any) => {
    event?.preventDefault();
    if (hostws) {
      hostws.send(JSON.stringify({ type: "create-meeting", email }));
    }
  };

  const startMeeting = (event: any) => {
    if (!hostws) return;
    hostws.send(JSON.stringify({ type: "start-meeting", email, sessionId }));
    hostws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "meeting-started") {
        navigate(`/room/${sessionId}`);
      }
    };
  };

  useEffect(() => {
    if (!hostws) {
      return;
    }

    hostws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log(message.sessionId);
      console.log(message);
      switch (message.type) {
        case "meeting-exists":
          setEmail(message.email);
          setSessionId(message.sessionId);
          break;
        case "meeting-created":
          setSessionId(message.sessionId);
          break;
      }
    };
  }, [hostws, setSessionId, setEmail, sessionId]);

  const copy = async () => {
    if (!sessionId) return;
    await navigator.clipboard.writeText(sessionId);
  };

  const truncatedSessionId = (sessionId: string) => {
    return sessionId.length > 13
      ? `${sessionId.substring(0, 13)}...`
      : sessionId;
  };

  return (
    <>
      <form
        onSubmit={createMeeting}
        className="flex flex-col h-[250px] border border-cobalt-4 p-8 rounded-xl gap-4 justify-center items-center"
      >
        <div className="flex gap-2">
          <label className="text-lg" htmlFor="email">
            Email &nbsp;
          </label>
          <input
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            type="email"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
        </div>
        <div className="w-full">
          <button className="bg-cobalt-4 w-full p-2 rounded-lg hover:bg-inidgo-6">
            Create Meeting
          </button>
        </div>
      </form>
      {sessionId && (
        <div className="flex p-2 min-h-[100px] gap-2 justify-center items-center border min-w-max rounded-xl border-cobalt-4">
          <input
            onClick={copy}
            type="button"
            value={truncatedSessionId(sessionId)}
            className="bg-cobalt-1 w-[226px] text-charcoal-6 px-4 py-2 rounded-lg hover:bg-cobalt-3 cursor-pointer hover:text-cobalt-1"
          />
          <button
            onClick={startMeeting}
            className="bg-cobalt-4 p-2 rounded-lg hover:bg-inidgo-6"
          >
            Start Meeting
          </button>
        </div>
      )}
    </>
  );
};

export default CreateMeeting;
