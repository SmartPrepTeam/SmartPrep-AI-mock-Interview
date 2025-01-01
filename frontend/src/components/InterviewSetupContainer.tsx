import InterviewProgressNav from './InterviewProgressNav';
import InterviewSetupForm from './InterviewSetupForm';
export default function InterviewSetupContainer() {
  return (
    <div className="text-white md:px-16 bg-black-100 min-h-screen w-full">
      <InterviewProgressNav />

      <div className="my-8 text-center container mx-auto p-4">
        <h2 className="text-2xl mb-4 ">
          Hi there, my name is <span className="text-[#a9c6f5]">Polly.</span>{' '}
          I'll be your personal{' '}
          <span className="text-[#a9c6f5]">interview</span> assistant.
        </h2>
      </div>

      <div className="flex px-2 md:p-6 [80vh]">
        <InterviewSetupForm />
      </div>
    </div>
  );
}
