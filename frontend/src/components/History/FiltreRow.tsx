import React, { useState, useEffect } from 'react';
import { RiFilterOffFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import {
  filtreByType,
  filtreByDifficulty,
  filtreByDuration,
  resetFiltre,
  searchByJobTitle,
} from '../../features/ListSlice';

const FiltreRow: React.FC = () => {
  const list: ('video' | 'textual')[] = ['video', 'textual'];
  const difficultyLevel: ('easy' | 'medium' | 'hard')[] = [
    'easy',
    'medium',
    'hard',
  ];
  const duration: ('short' | 'medium' | 'long')[] = ['short', 'medium', 'long'];

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<
    'video' | 'textual' | 'List'
  >('List');
  const [_selectedStatus, setSelectedStatus] = useState<
    'complete' | 'incomplete' | 'Status'
  >('Status');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'easy' | 'medium' | 'hard' | 'DifficultyLevel'
  >('DifficultyLevel');
  const [selectedDuration, setSelectedDuration] = useState<
    'short' | 'medium' | 'long' | 'Duration'
  >('Duration');

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchByJobTitle(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleReset = (): void => {
    setSelectedType('List');
    setSelectedStatus('Status');
    setSelectedDifficulty('DifficultyLevel');
    setSelectedDuration('Duration');
    dispatch(resetFiltre());
    setSearchQuery('');
  };

  return (
    <div className="lg:mt-14 md:mt-10 sm:mt-10 sm:mb-2  w-full h-12 flex items-center justify-center space-x-4 sm:space-x-6">
      {/* Select for Type */}
      <select
        className="select rounded-md pl-2"
        value={selectedType}
        onChange={(e) => {
          const value = e.target.value as 'video' | 'textual';
          setSelectedType(value);
          dispatch(filtreByType(value));
        }}
      >
        <option value="">List </option>
        {list.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      {/* Select for Status
      <select
        className="select"
        value={selectedStatus}
        onChange={(e) => {
          const value = e.target.value as "complete" | "incomplete" | "Status";
          setSelectedStatus(value);
          dispatch(filtreByStatus(value));
        }}
      >
        <option value=''  >Status</option>
        {status.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select> */}

      {/* Select for Difficulty */}
      <select
        className="select rounded-md pl-2"
        value={selectedDifficulty}
        onChange={(e) => {
          const value = e.target.value as
            | 'easy'
            | 'medium'
            | 'hard'
            | 'DifficultyLevel';
          setSelectedDifficulty(value);
          dispatch(filtreByDifficulty(value));
        }}
      >
        <option value="">Difficulty Level</option>
        {difficultyLevel.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      {/* Select for Duration */}
      <select
        className="select rounded-md pl-2"
        value={selectedDuration}
        onChange={(e) => {
          const value = e.target.value as
            | 'short'
            | 'medium'
            | 'long'
            | 'Duration';
          setSelectedDuration(value);
          dispatch(filtreByDuration(value));
        }}
      >
        <option value="">Duration</option>
        {duration.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      {/* Reset Button */}
      <RiFilterOffFill
        className="text-white cursor-pointer ml-2"
        size={25}
        onClick={handleReset}
      />

      {/* Search Input */}
      <input
        className="bg-[#f2edff] text-black h-8 px-3  lg:w-48 md:w-36  sm:w-24 sm:text-xs text-left lg:text-sm rounded-sm"
        type="text"
        placeholder="Search by job title"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

export default FiltreRow;
