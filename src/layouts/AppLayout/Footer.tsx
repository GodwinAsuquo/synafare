import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/yellowLogo.svg';
import { navLinks, socialLinks } from '../../utils/constants';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#000F06] py-20 lg:px-24 text-white">
      <div className="w-[80%] md:w-[60%] lg:w-[85%] mx-auto lg:flex items-start justify-between">
        <img src={logo} alt="logo" />
        <div className="flex items-start justify-between lg:space-x-56 mt-16 lg:mt-0">
          <div>
            <h4 className="font-bold">Quick Links</h4>
            <ul className="text-sm font-light space-y-5 mt-6">
              {navLinks.map((d, i) => {
                return (
                  <li key={i} onClick={() => navigate(d.path)}>
                    {d.title}
                  </li>
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
                    className="flex space-x-3 items-center "
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

export default Footer;
