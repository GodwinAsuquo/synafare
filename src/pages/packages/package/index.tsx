import { useNavigate, useParams } from 'react-router-dom';
import chevronRight from '../../../assets/icons/chevronRight.svg';
import AppliancesList from './ApplianceList';
import { useEffect } from 'react';
import { PATHS } from '../../../utils/enum';
import { useFetchInverterPackages } from '../../../services/query/useCMS';

const Package = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: inverterPackages, isLoading } = useFetchInverterPackages();

  const inverterPackage = inverterPackages?.find((d: any) => d.slug === slug);

  const selectedInverterPackage = inverterPackage ? inverterPackage : '';

  useEffect(() => {
    localStorage.setItem('INVERTER_PACKAGE', JSON.stringify(selectedInverterPackage));
  }, [selectedInverterPackage]);

  if (isLoading) {
    return <p className="text-center my-48">Loading...</p>;
  }

  if (!inverterPackage) {
    return <div className="my-32 px-24">Package not found</div>;
  }

  const { imageUrl, description, inverterCapacity, title } = inverterPackage;

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
        <p className="text-[#344054] font-semibold text-nowrap hover:cursor-pointer mr-10">{title}</p>
      </div>

      <div className="lg:flex items-start justify-between gap-12 pt-14 bg-white px-5 lg:px-24 lg:w-[95%] mx-auto">
        <img
          src={imageUrl}
          alt={inverterCapacity}
          className="rounded-2xl w-full object-cover lg:sticky top-48 md:w-[45%] mx-auto"
        />

        <div className="lg:w-[50%] min-h-[800px]">
          <h2 className="text-3xl font-semibold mt-5 md:text-center lg:text-left">{title}</h2>
          <p className="my-4 text-[#667185] font-light">{description}</p>
          {/* Pass all packages to the AppliancesList component */}
          <AppliancesList inverterPackage={inverterPackage} allPackages={inverterPackages} />
        </div>
      </div>
    </div>
  );
};

export default Package;
