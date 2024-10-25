import { useState } from 'react';
import { testimonials } from '../../utils/constants';
import leftArrow from '../../assets/icons/circledLeftArrow.svg';
import rightArrow from '../../assets/icons/circledRightArrow.svg';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');

  const handleSlide = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === 'right') {
          return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
        } else {
          return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
        }
      });
      // Reset animation state after content change
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 500); // Match this with animation duration
  };

  const { quote, name, role, image } = testimonials[currentIndex];

  return (
    <div>
      <h2 className="text-center font-medium text-3xl mt-48">What Our Partners Say</h2>
      <div className="mt-10 bg-[#FFFDF4] w-[80%] mx-auto py-7 px-10">
        <div className="flex items-center justify-between">
          <div className="w-[40%] overflow-hidden">
            <div
              key={currentIndex}
              className={`transform transition-all duration-500 ease-in-out ${
                isAnimating && slideDirection === 'left'
                  ? '-translate-x-full'
                  : isAnimating && slideDirection === 'right'
                  ? 'translate-x-full'
                  : 'translate-x-0'
              }`}
            >
              <img src={image} alt={`${name}'s testimonial`} className="w-full" />
            </div>
          </div>

          <div className="flex flex-col justify-between h-[320px] w-[50%]">
            <div className="overflow-hidden">
              <div
                key={currentIndex + '-quote'}
                className={`transform transition-all duration-500 ease-in-out ${
                  isAnimating && slideDirection === 'left'
                    ? '-translate-x-full'
                    : isAnimating && slideDirection === 'right'
                    ? 'translate-x-full'
                    : 'translate-x-0'
                }`}
              >
                <h4 className="text-3xl">{quote}</h4>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="overflow-hidden">
                <div
                  key={currentIndex + '-author'}
                  className={`transform transition-all duration-500 ease-in-out ${
                    isAnimating && slideDirection === 'left'
                      ? '-translate-x-full'
                      : isAnimating && slideDirection === 'right'
                      ? 'translate-x-full'
                      : 'translate-x-0'
                  }`}
                >
                  <h5 className="font-medium">{name}</h5>
                  <p className="text-gray-600">{role}</p>
                </div>
              </div>

              <div className="flex space-x-3 items-center">
                <button
                  onClick={() => handleSlide('right')}
                  className="hover:opacity-80 transition-opacity"
                  disabled={isAnimating}
                >
                  <img src={leftArrow} alt="Previous testimonial" />
                </button>
                <button
                  onClick={() => handleSlide('left')}
                  className="hover:opacity-80 transition-opacity"
                  disabled={isAnimating}
                >
                  <img src={rightArrow} alt="Next testimonial" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
