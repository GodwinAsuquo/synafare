import Button from '../../components/shared/Button';
import associateInstaller from '../../assets/images/associateInstaller.png';
import { becomeAPartnerArray, socialProof } from '../../utils/constants';

const BecomeAPartner = () => {
  return (
    <section>
      <div className="bg-[#FFF9E6] py-20 ">
        <p className="text-[#407068] text-center">Scale Your Solar Business with Ease</p>
        <h2 className="text-3xl font-semibold w-[35%] text-center mx-auto mt-3">
          Whatever your role in the solar energy ecosystem, Synafare has the tools to help you succeed.
        </h2>

        <div className="mx-auto w-[70%] flex items-center mt-24">
          <img src={associateInstaller} alt="Associate Installer" className="w-[380px] mr-32" />
          <div className="space-y-12 ">
            <h3 className="text-3xl font-medium">Associate Installer</h3>
            <p className="text-gray-500 text-lg font-light ">
              Partner with Synafare to access essential resources, streamline customer management, and benefit from
              affordable financing. We’re here to help you grow your solar installation business.
            </p>
            <Button />
          </div>
        </div>
      </div>

      <div>
        {becomeAPartnerArray.map((d, i) => {
          return (
            <div key={i} className={`${i % 2 === 0 ? 'flex-row-reverse' : ''} mx-auto w-[70%] flex items-center mt-32`}>
              <img src={d.image} alt="Associate Installer" className={`w-[380px] ${i % 2 === 0 ? 'ml-32' : 'mr-32'}`} />
              <div className="space-y-12">
                <h3 className="text-3xl font-medium">{d.title}</h3>
                <p className="text-gray-500 text-lg font-light">{d.desc}</p>
                <Button />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-x-20 w-[80%] mx-auto my-44">
        {socialProof.map((d, i) => {
          return (
            <div key={i} className='h-[192px] flex flex-col justify-between'>
              <img src={d.icon} alt="" className='w-fit'/>
              <h3 className='text-4xl'>{d.metric}</h3>
              <p className='gray-500 font-light text-sm'>{d.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BecomeAPartner;
