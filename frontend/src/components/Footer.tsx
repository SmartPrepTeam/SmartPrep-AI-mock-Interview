import { useNavigate } from 'react-router-dom';
import MagicButton from './ui/MagicButton';
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col items-center ">
        <h1 className="font-bold text-center text-[40px] md:text-5xl lg:text-4xl max-w-[600px] ">
          Realize your <span className="text-purple">potential. </span>
        </h1>
        <h1 className="font-bold text-center text-[40px] md:text-5xl lg:text-4xl max-w-[600px] ">
          Redefine your future.
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Let us Empower you with the tools and confidence to ace every
          interview
        </p>
        <a>
          <MagicButton
            title="Get Started"
            position="right"
            handleClick={() => {
              navigate('/signup');
            }}
          />
        </a>
      </div>

      <div className="flex justify-center items-center w-full mt-10">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2024 SmartPrep
        </p>
      </div>
    </footer>
  );
};

export default Footer;
