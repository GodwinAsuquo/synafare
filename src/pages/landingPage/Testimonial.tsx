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

  const { quote, name, role } = testimonials[currentIndex];
  // lg:flex items-center justify-between
  return (
    <div id="testimonial">
      <h2 data-aos="fade-down" className="w-[90%] mx-auto md:text-center font-medium text-3xl mt-32 lg:mt-48">
        What Our Partners Say
      </h2>
      <div className="mt-10 bg-[#FFFDF4] rounded-lg w-[90%] md:w-full  mx-auto py-10 px-5 md:px-10 min-h-[500px] md:min-h-[600px] lg:min-h-[400px]">
        <div className=" mx-auto md:w-[80%] max-w-7xl">
          {/* <div className="lg:w-[40%] overflow-hidden">
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
          </div> */}

          <div className="flex flex-col justify-between h-[320px] lg:w-full mt-10 lg:mt-0">
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
                <h4 className="text-lg md:text-3xl leading-[1.7] lg:leading-0">{quote}</h4>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="overflow-hidden">
                <div
                  key={currentIndex + '-author'}
                  className={`hidden lg:block transform transition-all duration-500 ease-in-out ${
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

              <div className="flex justify-between w-full lg:w-fit lg:space-x-3 items-center">
                <button
                  onClick={() => handleSlide('right')}
                  className="hover:opacity-80 transition-opacity"
                  disabled={isAnimating}
                >
                  <img src={leftArrow} alt="Previous testimonial" />
                </button>
                <div className="overflow-hidden">
                  <div
                    key={currentIndex + '-author'}
                    className={`lg:hidden transform transition-all duration-500 ease-in-out ${
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
