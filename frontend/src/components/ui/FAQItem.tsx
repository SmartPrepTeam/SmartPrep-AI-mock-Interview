import { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import 'react-slidedown/lib/slidedown.css';

interface FaqItemProps {
  item: {
    id: string;
    question: string;
    answer: string;
  };
  index: number;
}

const FAQItem: React.FC<FaqItemProps> = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="relative z-[2] mb-[4rem]"
      style={{ cursor: 'pointer' }}
      onClick={toggleAnswer}
    >
      <div className="group relative flex items-center justify-between gap-[2.5rem] px-[1.75rem]">
        <div className="flex-1">
          <div className="text-purple mb-[0.375rem] max-lg:hidden">
            {index < 10 ? '0' : ''}
            {index}
          </div>
          <div
            className={`h6 text-white transition-colors duration-[500ms] max-md:flex max-md:min-h-[5rem] max-md:items-center ${isOpen && 'text-[#CBACF9]'}`}
          >
            {item.question}
          </div>
        </div>

        <div className="cursor-pointer transition-transform duration-[300ms]">
          {isOpen ? (
            <FaChevronUp size={24} color="#C4CBF5" />
          ) : (
            <FaChevronDown size={24} color="#C4CBF5" />
          )}
        </div>
      </div>

      <SlideDown>
        {isOpen && (
          <div className="text-lg px-[1.75rem] py-[0.875rem] text-white">
            {item.answer}
          </div>
        )}
      </SlideDown>
    </div>
  );
};

export default FAQItem;
