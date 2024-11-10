
interface Props {
    email: string | null;
    className?: string;
}

const VideoOff = ({email, className}:Props) => {
  return (
    <div className={className}>
      <div className="">{email[0].toUpperCase()}</div>
    </div>
  );
}

export default VideoOff
