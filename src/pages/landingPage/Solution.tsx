import { clienteleLogos } from '../../utils/constants';
import distributor from '../../assets/images/distributor.png';
import manufacturer from '../../assets/images/manufacturer.png';
import thunder from '../../assets/icons/thunder.svg';
import mail from '../../assets/icons/mail.svg';
import blueCheck from '../../assets/icons/blueCheck.svg';
import orangeCheck from '../../assets/icons/orangeCheck.svg';
import BecomePartnerButton from '../../components/shared/BecomePartnerButton';
import ExplorePackagesButton from '../../components/shared/ExplorePackagesButton';

const solarBenefits = [
  'Go solar without upfront costs.',
  'Flexible financing plans tailored to fit your budget.',
  'Connect with trusted solar installers near you.',
];

const synafareBenefits = [
  'Boost your sales by offering clients seamless financing.',
  'Expand your customer base with affordable solar options.',
  'Let Synafare handle the financial details.',
];

const Solution = () => {
  return (
    <div className="mt-32 mb-52  mx-auto ">
      <p className="text-center text-[#646464] text-xl">Our Partners</p>
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
      <div data-aos="fade-up" className="pt-32">
        <div className=" mt-3 max-w-7xl mx-auto">
          <div id="our-solution" className="w-[90%] md:w-[60%] mx-auto md:text-center font-semibold">
            <p className="text-[#3D89DF]">Financing Solutions for Installers and Homeowners</p>
            <h2 className="text-3xl mt-5">Powering Every Part of the Solar Ecosystem</h2>
            <p className="text-[#535862] font-light mt-3">
              We make solar financing simple and accessible, helping homeowners switch to clean energy and empowering
              installers to grow their business.
            </p>
          </div>
        </div>
      </div>

      {/* For Businesses & Residences */}
      <div className="max-w-[1440px] mx-auto">
        <div
          data-aos="fade-up"
          className={`mx-auto w-[90%] md:w-[50%] lg:w-full lg:flex items-center justify-between mt-32 space-y-10 lg:space-y-0`}
        >
          <img src={manufacturer} alt="Associate Installer" className={`lg:w-[46%] lg:mr-28`} />
          <div className="space-y-8 lg:space-y-12 lg:w-[50%] lg:pr-28">
            <img src={thunder} alt="thunder" width={40} />
            <h3 className="text-3xl font-medium">For Businesses & Residences</h3>
            <p className="text-gray-500 text-lg font-light">
              Switch to solar effortlessly with flexible financing options. Enjoy clean energy without the stress of
              upfront payments.
            </p>
            <div className="space-y-4">
              {solarBenefits.map((d, i) => {
                return (
                  <div key={i} className="flex items-center space-x-3 text-[#535862] ">
                    <img src={blueCheck} alt="" className="mt-1" />
                    <p>{d}</p>
                  </div>
                );
              })}
            </div>
            <ExplorePackagesButton />
          </div>
        </div>

        {/* For Distributors & Installers  */}
        <div
          data-aos="fade-up"
          className={`flex-row-reverse mx-auto w-[90%] md:w-[50%] lg:w-full lg:flex items-center justify-between mt-32 space-y-10 lg:space-y-0`}
        >
          <img src={distributor} alt="Associate Installer" className={`lg:w-[46%] lg:ml-28`} />
          <div className="space-y-8 lg:space-y-12 lg:w-[50%] lg:pl-28">
            <img src={mail} alt="" width={40} />
            <h3 className="text-3xl font-medium">For Distributors & Installers</h3>
            <p className="text-gray-500 text-lg font-light">
              Boost your business by offering clients easy solar financing. Close more deals and make renewable energy
              accessible to all.
            </p>
            <div className="space-y-4">
              {synafareBenefits.map((d, i) => {
                return (
                  <div key={i} className="flex items-center space-x-3 text-[#535862] ">
                    <img src={orangeCheck} alt="" className="mt-1" />
                    <p>{d}</p>
                  </div>
                );
              })}
            </div>
            <BecomePartnerButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;
