import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/enum';

const BecomePartnerButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(PATHS.PARTNER_REGISTRATION_FORM)}>
      <div className="flex items-center justify-center  space-x-2 text-white bg-[#201E1F] py-2 px-3 rounded-lg border-2 text-sm border-[#4F986A] ">
        <p>Become a Partner</p>
        <FaArrowRight className="mt-1" />
      </div>
    </button>
  );
};

export default BecomePartnerButton;
