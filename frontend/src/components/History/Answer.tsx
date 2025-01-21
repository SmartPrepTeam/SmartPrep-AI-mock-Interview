import React from 'react';

type HistoryAnswerProps ={
  answer: string;
}

const Answer: React.FC<HistoryAnswerProps> = ({ answer }) => {
  return (
    <div className="lg:w-[800px] h-fit rounded-bl-xl rounded-br-xl ml-2 mr-2 p-2 cursor-pointer ">
      {answer}
    </div>
  );
};

export default Answer;
