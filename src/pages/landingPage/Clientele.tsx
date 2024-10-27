import { clienteleLogos, takeChargeData } from '../../utils/constants';
import takeCharge from '../../assets/images/takeCharge.png';
import takeChargeMobile from '../../assets/images/takeChargeMobile.png';

import logo from '../../assets/icons/blackLogo.svg';

const Clientele = () => {
  return (
    <div className="my-32  mx-auto ">
      <p className="text-center text-[#646464] text-xl">Our Clientele</p>

      {/* logos  */}
      <div className="relative flex overflow-hidden bg-white mt-10 max-w-[1440px] mx-auto">
        {/* Mask for smooth transition */}
        <div className="flex logos-slide">
          {/* First set of logos */}
          {clienteleLogos.map((logo, i) => (
            <img key={`first-${i}`} src={logo} alt="logo" className="w-32 mx-10" />
          ))}
          {/* Second set of logos */}
          {clienteleLogos.map((logo, i) => (
            <img key={`second-${i}`} src={logo} alt="logo" className="w-32 mx-10" />
          ))}
          {/* Third set of logos for extra smoothness */}
          {clienteleLogos.map((logo, i) => (
            <img key={`third-${i}`} src={logo} alt="logo" className="w-32 mx-10" />
          ))}
        </div>
      </div>

      {/* end  */}

      <div className="w-[90%] md:w-[80%] mx-auto max-w-7xl">
        <div>
          <h2
            data-aos="fade-up"
            className="text-primary text-3xl lg:text-4xl font-semibold lg:font-bold lg:w-[35%] mx-auto text-center mt-32"
          >
            Take Charge of Your Solar Financing Today
          </h2>
          <img data-aos="fade-up" src={takeChargeMobile} alt="" className="w-full mt-16 md:hidden" />
          <img data-aos="fade-up" src={takeCharge} alt="" className="w-full mt-16 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 w-[80%] md:w-[60%] lg:w-full mx-auto mt-28 gap-20">
          {takeChargeData.map((d, i) => {
            return (
              <div data-aos="zoom-in-down" key={i} className="space-y-6">
                <img src={logo} alt="" />
                <h4 className="text-primary font-medium text-xl">{d.title}</h4>
                <p className="text-gray-500 font-light text-sm">{d.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Clientele;
