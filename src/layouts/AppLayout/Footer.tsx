import logo from '../../assets/icons/yellowLogo.svg';
import useMetaEvents from '../../services/query/useMeta';
import { navLinks, socialLinks } from '../../utils/constants';
import { Link } from 'react-scroll';

const Footer = () => {
  const { trackContact } = useMetaEvents();

  // Function to handle contact link clicks
  const handleContactClick = (platform: string) => {
    // Track the Contact event for Meta Conversions API
    trackContact({
      userData: {}, // No user data available at this point
      customData: {
        contact_method: platform,
        contact_source: 'footer',
      },
    });

    // Also trigger the standard Pixel event if fbq is available
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: platform,
        content_category: 'contact',
      });
    }
  };

  return (
    <footer className="bg-[#000F06] py-20 lg:px-24 text-white">
      <div className="w-[80%] md:w-[60%] lg:w-[85%] mx-auto max-w-7xl lg:flex items-start justify-between">
        <Link to="top" smooth={true} duration={1000}>
          <img src={logo} alt="logo" />
        </Link>
        <div className="flex items-start justify-between lg:space-x-56 mt-16 lg:mt-0">
          <div>
            <h4 className="font-bold">Quick Links</h4>
            <ul className="text-sm font-light mt-6">
              {navLinks.map((d, i) => {
                return (
                  <Link key={i} to={d.id} smooth={true} duration={1000} offset={-90}>
                    <li className="mt-5">{d.title}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div>
            <h4 className="font-bold">Contact</h4>
            <ul className="text-sm font-light space-y-5 mt-6">
              {socialLinks.map((d, i) => {
                return (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex space-x-3 items-center"
                    onClick={() => handleContactClick(d.platform)}
                  >
                    <div className="w-5">
                      <img src={d.icon} alt={d.platform} />
                    </div>
                    <p>{d.platform}</p>
                  </a>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <hr className="border-t-[0.5px] mt-16 border-gray-700" />
      <p className="text-center text-sm font-light mt-10">{new Date().getFullYear()} Synafare. All right reserved.</p>
    </footer>
  );
};

// Add this to the global scope for TypeScript support
declare global {
  interface Window {
    fbq?: (track: string, eventName: string, params?: any) => void;
  }
}

export default Footer;
