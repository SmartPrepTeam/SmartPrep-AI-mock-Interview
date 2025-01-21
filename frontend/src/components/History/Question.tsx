import React from 'react'

type props={
  question:string;
  index:number;
}
const  Question: React.FC<props>=({question ,index})=> {
  return (
    <div className="lg:w-[1000px] md:w-[500] h-fit  ml-2 mr-2 rounded-bl-xl rounded-br-xl border-t-2 p-2 bg-black-100 cursor-pointer hover:bg-black-200">Question : {index+1} {question}</div>
  )
}

export default Question
