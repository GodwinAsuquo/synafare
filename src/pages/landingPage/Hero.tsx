import Button from '../../components/shared/Button';

const Hero = () => {
  return (
    <section>
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
        <div className="absolute text-white md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 ">
          <div className="w-[90%] lg:w-[80%] mx-auto text-center space-y-10">
            <h2 className="text-3xl lg:text-5xl font-medium ">
              Grow Your Clean Energy Business with <span className="text-[#FEC601]">Synafare</span>
            </h2>
            <p className="text-lg">
              Our platform empowers renewable energy business owners to boost sales, secure financing, and manage
              customers effortlessly.
            </p>
            <div className="flex space-x-3 md:space-x-5 mx-auto w-fit text-sm">
              <button className="text-primary bg-white py-2 px-2 md:px-3 rounded-lg border-2 border-white">
                Explore our services
              </button>
              <Button />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// https://res.cloudinary.com/dali2kmqa/video/upload/v1729767847/synafare/aeb4505f-7eda-476a-9c8c-02b8aebe0130_bk2kz2.mp4
