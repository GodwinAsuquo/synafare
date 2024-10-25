import { clienteleLogos, takeChargeData } from '../../utils/constants';
import takeCharge from '../../assets/images/takeCharge.png';
import logo from '../../assets/icons/blackLogo.svg';

const Clientele = () => {
  return (
    <div className="my-32 w-[90%] md:w-[80%] max-w-7xl mx-auto">
      <p className="text-center text-[#646464] text-xl">Our Clientele</p>

      <div className="grid grid-cols-2 gap-7 md:flex md:flex-wrap space-x-14 w-fit mx-auto mt-10">
        {clienteleLogos.map((d, i) => {
          return <img key={i} src={d} alt="logo" className="w-32" />;
        })}
      </div>

      <div>
        <h2 className='text-primary text-4xl font-bold w-[35%] mx-auto text-center mt-32'>Take Charge of Your Solar Financing Today</h2>
        <img src={takeCharge} alt="" className='w-full mt-16'/>
      </div>

      <div className='grid grid-cols-3 w-full mt-28 gap-20'>
        {
            takeChargeData.map((d,i) => {
                return <div key={i} className='space-y-6'>
                    <img src={logo} alt="" />
                    <h4 className='text-primary font-medium text-xl'>{d.title}</h4>
                    <p className='text-gray-500 font-light text-sm'>{d.description}</p>
                </div>
            })
        }
      </div>
    </div>
  );
};

export default Clientele;
