
import BecomePartnerButton from '../../components/shared/BecomePartnerButton';
// import { PATHS } from '../../utils/enum';
import { Link } from 'react-router-dom';

const Hero = () => {
 

  return (
    <section id="top">
      <div className="relative w-full h-screen md:h-[820px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute w-full h-full object-cover"
          src="https://res.cloudinary.com/dali2kmqa/video/upload/v1729767847/synafare/aeb4505f-7eda-476a-9c8c-02b8aebe0130_bk2kz2.mp4"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute text-white md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 lg:w-full">
          <div className="w-[90%] lg:w-[80%] mx-auto text-center space-y-10">
            <h2 className="text-3xl lg:text-5xl font-medium">
              Flexible Solar Financing for <span className="text-[#FEC601]">Everyone</span>
            </h2>
            <p className="text-lg md:w-[90%] lg:w-[70%] mx-auto">
              Unlock affordable solar solutions, whether you're an installer helping clients switch to clean energy or a
              homeowner seeking flexible payment plans.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-2 mx-auto w-fit text-sm">
              <BecomePartnerButton />
              <Link to="/finance-request-form">
                <button
                  // onClick={() => navigate(PATHS.PACKAGES)}
                  className="text-primary bg-white py-2 px-2 md:px-3 rounded-lg border-2 border-white"
                >
                  Request For Finance
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// https://res.cloudinary.com/dali2kmqa/video/upload/v1729767847/synafare/aeb4505f-7eda-476a-9c8c-02b8aebe0130_bk2kz2.mp4
