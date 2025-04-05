import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/enum';

const BecomePartnerButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(PATHS.PARTNER_REGISTRATION_FORM)}>
      <p>Become a Partner</p>
      <FaArrowRight className="mt-1" />
    </button>
  );
};

export default BecomePartnerButton;
