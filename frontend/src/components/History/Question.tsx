import React from 'react';

type props = {
  question: string;
  index: number;
};
const Question: React.FC<props> = ({ question, index }) => {
  return (
    <div
      className="lg:w-[1000px] md:w-[500] h-fit  ml-2 mr-2  p-3 rounded-xl border border-white/[0.1] cursor-pointer"
      style={{
        background: 'rgb(4,7,29)',
        backgroundColor:
          'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
      }}
    >
      Question : {index + 1} {question}
    </div>
  );
};

export default Question;
