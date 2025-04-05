import { useNavigate } from 'react-router-dom';
import chevronRight from '../../assets/icons/chevronRight.svg';
import { useFetchInverterPackages } from '../../services/query/useCMS';
import inverterImage from '../../assets/images/inverterImage.png';

const Packages = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useFetchInverterPackages();

  const inverterPackages = data ? data : '';

  if (isLoading) {
    return <p className="text-center my-48">Loading...</p>;
  }

  return (
    <div className="my-32 px-5 md:px-12 lg:px-24">
      {/* breadcrumbs  */}
      <div className="flex items-center space-x-2 fixed top-0 pt-28 pb-5 w-full z-40 bg-white text-nowrap whitespace-nowrap">
        <p onClick={() => navigate('/')} className="text-[#667185] text-nowrap hover:cursor-pointer">
          Home
        </p>
        <img src={chevronRight} alt="chevron right" />
        <p className="text-[#344054] font-semibold text-nowrap hover:cursor-pointer mr-10">Our Products</p>
      </div>

      <div>
        <h1 className="text-3xl font-semibold w-fit mx-auto mt-48">Solar Packages</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 lg:mt-16">
          {inverterPackages.map((d: any, i: number) => {
            return (
              <div key={i}>
                <img
                  src={d.imageUrl || inverterImage}
                  alt={d.inverterCapacity}
                  className="rounded-lg object-cover object-center h-[280px] w-full"
                />

                <div className="flex flex-col justify-between space-y-4 mt-5">
                  <div className="flex justify-between items-center">
                    <p>{d.title}</p>
                  </div>
                  <p className="line-clamp-2 text-[#667185] text-sm">{d.description}</p>

                  <button
                    onClick={() => navigate(`/solar-packages/${d.slug}`)}
                    className="px-3 py-1 border border-[#D0D5DD] rounded-full w-fit text-sm"
                  >
                    See Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="bg-[#F6F6F6] text-center px-5 py-14 md:px-10 space-y-5 rounded-xl mt-24">
        <h1 className="text-3xl lg:text-4xl font-bold">Not sure what setup you need?</h1>
        <p>Let’s help you with a recommendation</p>
        <div
         onClick={()=>navigate}
          className="flex items-center justify-center space-x-2 text-white bg-[#201E1F] py-2 px-3 rounded-xl border-2 text-sm border-[#4F986A] w-fit mx-auto"
        >
          Get Started
        </div>
      </div> */}
    </div>
  );
};

export default Packages;
