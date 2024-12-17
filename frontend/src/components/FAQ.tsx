import { faq } from '@/data';
import FAQItem from '@/components/ui/FAQItem';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQ: React.FC = () => {
  const halfLength = Math.floor(faq.length / 2);

  return (
    <section className="relative py-16" id="FAQ">
      <div className="container mx-auto text-center mb-12 px-4">
        <h3 className="font-bold text-4xl text-white">
          Curiosity didn't kill the cat, <br />
          <span className="text-purple">it got answers.</span>
        </h3>
        <p className="text-lg text-white mt-4">
          You've got questions, we've got answers.
        </p>
      </div>

      <div className="relative flex justify-center mb-12">
        <div className="rounded-full w-20 h-20 flex items-center justify-center border-2 border-[#0C1838] bg-black-100 z-10">
          <FaQuestionCircle className="size-10 " />
        </div>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row justify-center relative">
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-[2px] bg-[#0C1838] z-0 hidden lg:block"></div>

        <div className="flex-1 relative z-10 pr-6 lg:pr-12">
          {faq.slice(0, halfLength).map((item, index) => (
            <FAQItem key={item.id} item={item} index={index + 1} />
          ))}
        </div>

        <div className="flex-1 relative z-10 pr-6 lg:pl-12">
          {faq.slice(halfLength).map((item, index) => (
            <FAQItem key={item.id} item={item} index={halfLength + index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
