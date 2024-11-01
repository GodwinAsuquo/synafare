import Button from '../../components/shared/Button';
import associateInstaller from '../../assets/images/associateInstaller.png';
import { becomeAPartnerArray, socialProof } from '../../utils/constants';
import CountUp from 'react-countup';

const BecomeAPartner = () => {
  return (
    <section>
      <div data-aos="fade-up" className="bg-[#FFF9E6] py-20 ">
        <div className=" mt-3 max-w-7xl mx-auto">
          <div className="w-[90%] md:w-[80%] lg:w-[40%]  mx-auto md:text-center font-semibold">
            <p className="text-[#407068] ">Scale Your Solar Business with Ease</p>
            <h2 className="text-3xl mt-5">
              Whatever your role in the solar energy ecosystem, Synafare has the tools to help you succeed.
            </h2>
          </div>

          <div className="mx-auto w-[90%] md:w-1/2 lg:w-[70%] lg:flex lg:items-center mt-24 space-y-10 lg:space-y-0">
            <img src={associateInstaller} alt="Associate Installer" className="w-[380px] mr-32" />
            <div className="space-y-5 lg:space-y-12">
              <h3 className="text-3xl font-medium">For Installers</h3>
              <p className="text-gray-500 text-lg font-light ">
                Synafare offers tailored financing plans that allow installers to meet the demand for solar and battery
                installations without the upfront costs. From project-based financing to extended terms, we make it easy
                for installers to expand their services.
              </p>
              <Button />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {becomeAPartnerArray.map((d, i) => {
          return (
            <div
              key={i}
              data-aos="fade-up"
              className={`${
                i % 2 === 0 ? 'flex-row-reverse' : ''
              } mx-auto w-[90%] md:w-[50%] lg:w-[70%] lg:flex items-center mt-32 space-y-10 lg:space-y-0`}
            >
              <img
                src={d.image}
                alt="Associate Installer"
                className={`w-[380px] ${i % 2 === 0 ? 'lg:ml-32' : 'lg:mr-32'}`}
              />
              <div className="space-y-8 lg:space-y-12">
                <h3 className="text-3xl font-medium">{d.title}</h3>
                <p className="text-gray-500 text-lg font-light">{d.desc}</p>
                <Button />
              </div>
            </div>
          );
        })}
      </div>

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
    </section>
  );
};

export default BecomeAPartner;
