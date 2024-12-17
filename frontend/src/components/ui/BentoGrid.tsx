import { cn } from '@/lib/utils';
import { BackgroundGradientAnimation } from './BackgroundGradientAnimation';
import GridGlobe from './GridGlobe';
import MagicButton from './MagicButton';
import { useNavigate } from 'react-router-dom';
import { StickyScroll } from './StickyScrollReveal';
import { content } from '@/data';
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  imgClassName,
  titleClassName,
  img,
  spareImg,
  id,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  titleClassName?: string;
  imgClassName?: string;
  img?: string;
  spareImg?: string;
  id?: number;
}) => {
  const leftLists = ['ReactJS Developer', 'DB Engineer', 'ML Engineer'];
  const rightLists = [
    'Business Analyst',
    'NuxtJS Developer',
    'Prompt Engineer',
  ];
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col',
        className
      )}
      style={{
        background: 'rgb(4,7,29)',
        backgroundColor:
          'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
      }}
    >
      {/* add image divs */}
      {(img || spareImg) && (
        <div className={`${id === 6 && 'flex justify-center'} h-full`}>
          <div className="w-full h-full absolute">
            {img && (
              <img
                src={img}
                alt={img}
                className={cn(imgClassName, 'object-cover object-center ')}
              />
            )}
          </div>
          <div
            className={`absolute right-0 -bottom-5 ${
              id === 5 && 'w-full opacity-80'
            } `}
          >
            {spareImg && (
              <img
                src={spareImg}
                alt={spareImg}
                //   width={220}
                className="object-cover object-center w-full h-full"
              />
            )}
          </div>
        </div>
      )}

      {id === 6 && (
        <BackgroundGradientAnimation>
          <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
        </BackgroundGradientAnimation>
      )}
      <div
        className={cn(
          id === 6 ? 'flex w-full h-full justify-center' : '',
          'relative'
        )}
      >
        <div
          className={cn(
            titleClassName,
            'group-hover/bento:translate-x-2 transition duration-200 relative h-full min-h-40 flex flex-col px-5 p-5 lg:p-10 text-white'
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-50">
            {description}
          </div>
          <div
            className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-50`}
          >
            {title}
          </div>

          {id === 2 && <GridGlobe />}

          {/* Tech stack list div */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-4 w-fit absolute -right-3 lg:-right-2 ">
              {/* tech stack lists */}
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-2 py-2 px-1 text-xs lg:text-base opacity-50 font-semibold
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                    style={{ color: 'white' }}
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-2 py-4 px-1  rounded-lg text-center bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-2 py-4 px-1  rounded-lg text-center bg-[#10132E]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-2 py-2 px-1 text-xs lg:text-base opacity-50 font-semibold
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                    style={{ color: 'white' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              <MagicButton
                title="Try Now"
                handleClick={() => {
                  navigate('/signup');
                }}
                otherClasses="!bg-[#161A31]"
              />
            </div>
          )}
          {/* For showing steps in component 5 */}
          {id === 5 && <StickyScroll content={content} />}
        </div>
      </div>
    </div>
  );
};
