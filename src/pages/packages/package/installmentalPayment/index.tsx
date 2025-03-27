import { useNavigate } from 'react-router-dom';
import chevronRight from '../../../../assets/icons/chevronRight.svg';
import InstallmentalPaymentForm from './InstallmentalPaymentForm';
import { PATHS } from '../../../../utils/enum';

const InstallmentalPayment = () => {
  const navigate = useNavigate();
  const inverterPackageData = localStorage.getItem('INVERTER_PACKAGE');
  const inverterPackage = inverterPackageData ? JSON.parse(inverterPackageData) : null;

  console.log({ inverterPackage });

  const { title, slug } = inverterPackage;
  return (
    <div className="my-32">
      {/* breadcrumbs  */}
      <div className="flex items-center space-x-2 fixed top-0 pt-28 pb-5 z-40 bg-white px-5 lg:px-24 overflow-x-scroll text-nowrap whitespace-nowrap">
        <p onClick={() => navigate('/')} className="text-[#667185] text-nowrap hover:cursor-pointer">
          Home
        </p>
        <img src={chevronRight} alt="chevron right" />
        <p onClick={() => navigate(PATHS.PACKAGES)} className="text-[#667185] text-nowrap hover:cursor-pointer">
          Our Products
        </p>
        <img src={chevronRight} alt="chevron right" />
        <p
          onClick={() => navigate(`/solar-packages/${slug}`)}
          className="text-[#667185] text-nowrap hover:cursor-pointer"
        >
          {title}
        </p>
        <img src={chevronRight} alt="chevron right" />
        <p className=" text-[#344054] font-semibold text-nowrap mr-10">Payment form</p>
      </div>

      <div className="pt-10 md:pt-20 md:w-[60%] lg:w-[40%] mx-auto">
        <h2 className="text-[#101928] text-center text-2xl md:text-3xl font-semibold">Installation Payment Form</h2>
        <p className="text-[#667185] text-center font-light mt-3">
          Spread your balance over monthly installments or pay in full. Choose a plan that suits you.
        </p>
        <div className="mt-5">
          <InstallmentalPaymentForm />
        </div>
      </div>
    </div>
  );
};

export default InstallmentalPayment;
