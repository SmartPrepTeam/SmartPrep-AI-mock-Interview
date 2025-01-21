import React from 'react';
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import { IoMdVideocam } from "react-icons/io";
import { MdIncompleteCircle } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { useDispatch } from 'react-redux';
import { deleteInterview } from '../../features/ListSlice';
import {useNavigate } from 'react-router-dom'
type Interview = {
  objectId: string;
  type: string;
  status: string;
  difficultyLevel: string;
  jobTitle: string;
  createdAt: string;
};

type HistoryRowProps = {
  interview: Interview;
  index: number;
};

const Row: React.FC<HistoryRowProps> = ({ interview, index }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  
  if (!interview) return null;

  const dateObj = new Date(interview.createdAt);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-orange-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <FaCheckCircle className="text-green-500" size={16} />;
      case "incomplete":
        return <MdIncompleteCircle className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const getColor = (index: number): string => {
    return index % 2 === 0 ? "bg-[#10132E]" : "bg-black-100";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <IoMdVideocam className="text-[#5f2b75]" size={16} />;
      case "textual":
        return <TfiWrite className="text-[#7fffd4]" size={16} />;
      default:
        return null;
    }
  };

  const handleDelete = (id: string): void => {
    const confirmed = window.confirm("Are you sure you want to delete this interview?");
    if (confirmed) {
      dispatch(deleteInterview(id));
      alert(`Interview ${id} deleted successfully!`);
    } else {
      alert(`Interview ${id} deletion canceled.`);
    }
  };
  const clickHandler=(id:string)=>{
    alert(`Interview ${id} clicked!`);
    navigate('/history-insights', { state: { interviewId: id } });
    
  }
  return (
    <tr className={`${getColor(index)}   text-sm  text-white lg:leading-tight md:leading-tight }`} onClick={()=>clickHandler(interview.objectId)} cursor-pointer >


      <td className="px-4 py-2 text-left rounded-tl-2xl rounded-bl-2xl">{index + 1}</td>
      <td className="px-4 py-2 text-center">{getTypeIcon(interview.type)}</td>
      <td className="px-4 py-2 lg:text-sm">{interview.jobTitle}</td>
      <td className="px-4 py-2 text-left">
        <div className="lg:text-xs md:text-[12px]">{date}</div>
        <div className="lg:text-[10px] md:text-[8px] hidden  sm:table-cell">{time}</div>
      </td>
      <td className={`px-4 py-2 hidden  sm:table-cell ${getDifficultyColor(interview.difficultyLevel)}`}>
        {interview.difficultyLevel}
      </td>
      {/* <td className="px-4 py-2 text-center">{getStatusIcon(interview.status)}</td> */}
      <td className="px-4 py-2 text-center rounded-tr-2xl rounded-br-2xl">
        <button className="p-1 hover:bg-teal-700 rounded " onClick={() => handleDelete(interview.objectId)}>
          <FaTrashAlt size={14} className="text-[#a9c6f5]" />
        </button>
      </td>
    </tr>
  );
}

export default Row;
