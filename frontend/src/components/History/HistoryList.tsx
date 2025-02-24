import React from 'react'

import ListContent from "./ListContent"
import ProgressGraph from './ProgressGraph'

const HistoryList: React.FC = () => {
  
  
  return (

    
    <div className="w-full bg-black-100 overflow-y-auto">
      <h1 className='text-white block md:hidden text-center text-3xl'>History</h1>
      
      <div className="flex justify-center mt-10  lg:h-[25vh]  md:h-[20vh] ">

              <div className=" text-white lg:w-[40%] md:w-[60%] sm:w-[70%] rounded-[6%]">

              <ProgressGraph />
              </div>

          
          
          
      </div>
      <ListContent />
    </div>
  )
}

export default HistoryList
