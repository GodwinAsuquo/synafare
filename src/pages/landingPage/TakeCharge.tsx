import { socialProof, takeChargeData } from '../../utils/constants';
import takeCharge from '../../assets/images/takeCharge.png';
import takeChargeMobile from '../../assets/images/takeChargeMobile.png';

import logo from '../../assets/icons/blackLogo.svg';
import CountUp from 'react-countup';

const TakeCharge = () => {
  return (
    <div className="my-32  mx-auto ">
    

      <div id="services" className="w-[90%] md:w-[80%] mx-auto max-w-7xl">
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

      {/* metric  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14 md:gap-x-20 w-[80%] md:w-[70%] lg:w-[80%] max-w-7xl mx-auto place-items-center my-44">
        {socialProof.map((d, i) => {
          return (
            <div key={i} className="h-[192px] flex flex-col justify-between">
              <img src={d.icon} alt="" className="w-fit" />
              <h3 className="text-4xl">
                {d.metric.includes('x') ? (
                  <>
                    <CountUp end={4} duration={2.5} enableScrollSpy />x
                  </>
                ) : d.metric.includes('₦') ? (
                  <>
                    ₦<CountUp end={0} duration={2.5} decimals={2} enableScrollSpy />
                  </>
                ) : d.metric.includes('%') ? (
                  <>
                    <CountUp end={parseInt(d.metric)} duration={2.5} enableScrollSpy />%
                  </>
                ) : (
                  d.metric
                )}
              </h3>
              <p className="gray-500 font-light text-sm">{d.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TakeCharge;
