import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInterviews } from '../../features/ListSlice';
import Row from './Row';
import { Interviews } from '../../helper/InterviewList';
 import axios from 'axios';
import { RootState } from '@/redux/store';

type Interview = {
  objectId: string;
  type: 'video' | 'textual';
  status: 'incompelete' | 'complete';
  difficultyLevel: 'easy' | 'medium' | 'hard';
  jobTitle: string;
  createdAt: string;
};

const Table: React.FC = () => {
  const dispatch = useDispatch();
  const filtredInterviews = useSelector((state: { interviews: { filtredInterviews: Interview[] } }) => state.interviews.filtredInterviews);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(setInterviews(Interviews));
  }, [dispatch]);



  const userId = useSelector((state: RootState) => state.auth.userId);
  const accessToken = useSelector((state: RootState) => state.auth.token);
 
  
  useEffect(() => {
    const fetchInterviews = async () => {
      console.log("user id :", userId)
      console.log("access token :", accessToken)
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/interviews/${userId}`);
        const response = await axios.get('/api/interviews', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        setInterviews(response.data); 
        console.log("response :",response.data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to fetch interviews. Please try again later.');
      }
    };

    fetchInterviews();
  }, [userId]);
  return (
    <div className="w-full  ">
      <table className="lg:w-11/12 md:w-11/12 sm:w-11/12  table-auto  lg:ml-5 lg:mr-5 ">
        <thead>
          <tr>
            <th className='table-heading'>#</th>
            <th className='table-heading'>Type</th>
            <th className='table-heading'>Job Title</th>
            <th className='table-heading'>Date</th>
            <th className='table-heading hidden  sm:table-cell '>Difficulty</th>
            {/* <th className='table-heading'>Status</th> */}
            <th className='table-heading'>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          
        {filtredInterviews.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-lg text-gray-500">
                No interviews found
              </td>
            </tr>
          ) : (
            filtredInterviews.map((interview, index) => (
              <Row key={interview.objectId} interview={interview} index={index} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

