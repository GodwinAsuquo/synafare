import { FaArrowRight } from 'react-icons/fa';

const Button = () => {
  return (
    <button className="flex space-x-2 text-white bg-[#201E1F] py-2 px-3 rounded-lg border-2 border-[#4F986A]">
      <p>Become a Partner</p>
      <FaArrowRight className="mt-1.5" />
    </button>
  );
}

export default Button