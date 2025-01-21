import React from 'react'
type props={
    label:string;
    isActive:boolean;
    onClick:()=>void
}
const  AnalysisButtons:React.FC<props>=({label,isActive, onClick})=>{
    console.log(label,isActive)
return (
    <button className={` lg:text-1xl rounded lg:w-32 md:w-28 sm:w-24  lg:h-10 text-white m-3 mt-10 ${isActive? 'bg-[#26294c] border-[2.5px] border-gray-300':'bg-[#10132E]' }`} onClick={onClick}>{label}</button>
)

 }

 export default AnalysisButtons