import { BentoGrid, BentoGridItem } from './ui/BentoGrid';
import { gridItems } from '@/data';
const Grid = () => {
  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {gridItems.map(
          (
            {
              className,
              title,
              id,
              description,
              imgClassName,
              titleClassName,
              img,
              spareImg,
            },
            i
          ) => {
            return (
              <BentoGridItem
                className={className}
                id={id}
                key={i}
                title={title}
                description={description}
                imgClassName={imgClassName}
                titleClassName={titleClassName}
                img={img}
                spareImg={spareImg}
              ></BentoGridItem>
            );
          }
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
