import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/enum';

const ExplorePackagesButton = () => {
  const navigate = useNavigate();
  return (
    <button>
      <a
        onClick={()=>navigate(PATHS.PACKAGES)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center  space-x-2 text-white bg-[#201E1F] py-2 px-3 rounded-lg border-2 text-sm border-[#4F986A] "
      >
        <p>Explore Solar Packages</p>
        <FaArrowRight className="mt-1" />
      </a>
    </button>
  );
};

export default ExplorePackagesButton;
