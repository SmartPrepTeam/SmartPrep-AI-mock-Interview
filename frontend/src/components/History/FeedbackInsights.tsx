import React from 'react';
import { useSelector } from 'react-redux';

import {Feedback } from '../../features/InsightsSlice'
type stateType = {
  historyInsights: {
      feedback: Feedback;
      answers: string[];
      questions: string[];
  };
};

const FeedbackInisghts :React.FC= () => {
  console.log('feedback called')
  const feedback=useSelector((state:stateType)=>state.historyInsights.feedback)
  console.log('Feedback history:',feedback)
  
  return (
    

      

      <div className="bg-black-100  lg-h-fill flex justity-center items-center lg:w-[500px] flex-col lg:border-2 rounded-2xl" >

        <div className="  flex flex-col ">
          <div className='flex flex-row'>

            <div className="feedback-card">
          <div className='feedback-heading'>Tone </div>
          <div className='lg:text-white lg:text-2xl'>
              {feedback.Tone}</div>
          </div>

          <div  className="feedback-card">
          <div className='feedback-heading'>Grammar </div>
            
            <div className='lg:text-white lg:text-2xl'>
              {feedback.Grammar}</div>
          </div>
          </div>
          
    <div className='flex flex-row'>
    <div className="feedback-card">
          <div className='feedback-heading'>Accuracy </div>
            
            <div className='lg:text-white lg:text-xl '>
              {feedback.Accuracy}</div>
          </div>

          <div className="feedback-card">
          <div className='feedback-heading'>Clarity </div>
            
            <div className='lg:text-white lg:text-2xl'>
              {feedback.Clarity}</div>
          </div>

    </div>
          
        
          
        </div>
        <div className='lg:text-white  lg:text-[15px] lg:h-36 lg:border-0  lg:rounded lg:m-3  lg:bg-[#090325] text-left p-2 hover:bg-[#726e7f]'>
         {feedback.Feedback}
        </div>

      </div>
    
  );
};

export default FeedbackInisghts;
