import { useEffect, useState } from 'react';
import logo from '../../assets/icons/logo.svg';
import { MdOutlineSubject } from 'react-icons/md';
// import { AiTwotoneCloseCircle } from 'react-icons/ai';
import { TbSunOff } from 'react-icons/tb';
import { Link } from 'react-scroll';
import { navLinks } from '../../utils/constants';

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileNavOpen]);

  return (
    <>
      <nav className="fixed z-50 flex justify-between items-center text-white backdrop-blur-sm bg-black/30 w-[90%] left-1/2 -translate-x-1/2 top-4 px-4 py-1 text-sm rounded-xl max-w-7xl">
        <Link to="top" smooth={true} duration={1000}>
          <img src={logo} alt="logo" className="w-[67px]" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link, index) => {
            return (
              <Link to={link.id} smooth={true} duration={1000} offset={-90}>
                <li key={index} className="cursor-pointer hover:text-gray-300 transition-colors">
                  {link.title}
                </li>
              </Link>
            );
          })}
        </ul>

        <button className="hidden lg:block text-white bg-[#201E1F] py-2 px-4 rounded-lg border-2 border-[#4F986A] hover:bg-[#2a2829] transition-colors">
          <a href="https://zdsineyv.forms.app/synafare-registration-form" target="_blank" rel="noopener noreferrer">
            Become a Partner
          </a>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileNav}
          className="lg:hidden text-white hover:text-gray-300 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <MdOutlineSubject size={30} />
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={closeMobileNav} />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed overflow-scroll top-0 right-0 w-[230px] md:w-[300px] text-sm h-full bg-[#201E1F] z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-10">
          <button
            onClick={closeMobileNav}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close mobile menu"
          >
            {/* <AiTwotoneCloseCircle size={35} /> */}
            <TbSunOff size={30} />
          </button>
        </div>

        <ul className="flex flex-col space-y-12 p-8 mt-8 text-white">
          {navLinks.map((link, index) => {
            return (
              <Link to={link.id} smooth={true} duration={1000} offset={-90}>
                {' '}
                <li
                  key={index}
                  className="cursor-pointer text-base hover:text-gray-300 transition-colors text-left"
                  onClick={closeMobileNav}
                >
                  {link.title}
                </li>
              </Link>
            );
          })}
          <li className="">
            <button className="text-white bg-[#201E1F] py-2 px-3 mt-32 rounded-lg border-2 border-[#4F986A]">
              <a href="https://zdsineyv.forms.app/synafare-registration-form" target="_blank" rel="noopener noreferrer">
                Become a Partner
              </a>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
