
const VideoInterviewHeader = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-black-100 ">
    <div className="text-display-3 p-4 text-white text-2xl font-bold">SmartPrep</div>

    <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4 rounded-t max-lg:mt-2 max-md:hidden font-bold text-x text-white">
      <span
        
      >
        INTRO
      </span>
      <span className="text-gray-500 font-bold">-</span>
      <span
 
      >
        INTERVIEW
      </span>
      <span className="text-gray-500 font-bold">-</span>
      <span
      
      >
        INSIGHTS
      </span>
    </div>
  </nav>
  )
}

export default VideoInterviewHeader