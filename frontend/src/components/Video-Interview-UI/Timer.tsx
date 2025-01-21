interface TimerProps {
  time: number;
  isRecording: boolean;
}

const Timer = ({ time, isRecording }: TimerProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      {isRecording && (
        <div className="absolute top-4 left-4 text-white font-bold text-xl bg-black opacity-50 px-2 py-1 rounded">
          {formatTime(time)}
        </div>
      )}
    </>
  );
};

export default Timer;