import React, {useState } from "react";
import Hero from "./Hero";
import CreateMeeting from "./CreateMeeting";
import JoinMeeting from "./JoinMeeting";

const Home = () => {
  const [meeting, setMeeting] = useState<'start' | 'join'>('start')

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => setMeeting(event.target.value as "start" | "join");

  return (
    <div className="flex flex-col w-full justify-center items-center gap-8">
      <Hero label="Connecting You Anywhere, Anytime" />
      <div className="flex gap-4 justify-center items-center">
        <div className="flex justify-center items-center gap-2">
          <input onChange={handleCheckbox} type="checkbox" value="start" checked={meeting === 'start'} />
          <label htmlFor="">Create Meeting</label>
        </div>
        <div className="flex justify-center items-center gap-2">
          <input onChange={handleCheckbox} type="checkbox" value="join" checked={meeting === 'join' } />
          <label htmlFor="">Join Meeting</label>
        </div>
      </div>
      {meeting === "start" ? <CreateMeeting /> : <JoinMeeting />}
    </div>
  );
};

export default Home;
