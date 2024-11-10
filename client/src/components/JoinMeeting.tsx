
const JoinMeeting = () => {
  return (
    <div className="flex flex-col h-[250px] border border-cobalt-4 p-8 rounded-xl gap-4 justify-center items-center">
      <form action="">
        <div className="flex gap-2">
          <input
            type="text"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
          <button className="bg-cobalt-4 w-full p-2 rounded-lg hover:bg-inidgo-6">
            Join Meeting
          </button>
        </div>
      </form>
    </div>
  );
}

export default JoinMeeting
