import { useEffect, useState } from 'react';
import logo from '../../assets/icons/logo.svg';
import { MdOutlineSubject } from 'react-icons/md';
import { TbSunOff } from 'react-icons/tb';
import { Link, scroller } from 'react-scroll';
import { navLinks } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  const handleNavClick = (link: any) => {
    if (link.route === '/') {
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(link.id, {
          duration: 1000,
          smooth: true,
          offset: -100,
        });

        localStorage.removeItem('scrollTo');
      }, 100);
    } else {
      navigate(link.route);
    }
  };

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
              <li
                key={index}
                onClick={() => handleNavClick(link)}
                className="cursor-pointer hover:text-gray-300 transition-colors"
              >
                <p>{link.title}</p>
              </li>
            );
          })}
        </ul>

        <button className="hidden  lg:flex justify-center  text-white bg-[#201E1F] py-2 px-4 rounded-lg border-2 border-[#4F986A] hover:bg-[#2a2829] transition-colors">
          <a
            href="https://forms.zohopublic.eu/segunsyna1/form/GetElectrifiedSignUpforSolarFinancing/formperma/KEQIyoZbvVhUDC6l_11JEPpjefZdIrNBmNmpj4Q2W8E"
            target="_blank"
            rel="noopener noreferrer"
          >
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
            <TbSunOff size={30} />
          </button>
        </div>

        <ul className="flex flex-col space-y-12 p-8 mt-8 text-white">
          {navLinks.map((link, index) => {
            return (
           
        
                <li key={index}
                  className="cursor-pointer text-base hover:text-gray-300 transition-colors text-left"
                  onClick={() => {
                    handleNavClick(link);
                    closeMobileNav();
                  }}
                >
                  {link.title}
                </li>
          
            );
          })}
          <li className="">
            <button className="text-white  flex justify-center bg-[#201E1F] py-2 px-3 mt-32 rounded-lg border-2 border-[#4F986A]">
              <a
                href="https://forms.zohopublic.eu/segunsyna1/form/GetElectrifiedSignUpforSolarFinancing/formperma/KEQIyoZbvVhUDC6l_11JEPpjefZdIrNBmNmpj4Q2W8E"
                target="_blank"
                rel="noopener noreferrer"
              >
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
