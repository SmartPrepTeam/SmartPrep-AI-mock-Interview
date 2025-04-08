import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-black-100 shadow">
      <button className="text-2xl font-bold  text-white pl-11">
        SmartPrep
      </button>
      <div className="flex items-center space-x-4 pr-10 w-1/3 "></div>
    </div>
  );
};

export default Header;
