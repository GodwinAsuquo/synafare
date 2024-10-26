import signUp from '../../assets/images/signUp.png';
import requestFinancing from '../../assets/images/requestFinancing.png';
import creditApproval from '../../assets/images/creditApproval.png';
import installAndTrack from '../../assets/images/installAndTrack.png';

const journey = [
  {
    title: 'Sign Up & Onboard',
    desc: 'Solar installers complete a simple onboarding process to join our platform.',
    image: signUp,
  },
  {
    title: 'Request Financing',
    desc: 'Installers submit requests for project financing through our user-friendly platform.',
    image: requestFinancing,
  },
  {
    title: 'Credit Approval',
    desc: 'Synafare reviews and approves financing based on project viability and installer creditworthiness.',
    image: creditApproval,
  },
  {
    title: 'Install & Track',
    desc: 'Once approved, installers complete the installation, while both installers and customers track repayments online.',
    image: installAndTrack,
  },
];

const SimplifiedJourney = () => {
  return (
    <section className="mx-auto md:w-[80%] lg:w-[60%] max-w-7xl ">
      <h2 className="text-4xl text-left font-medium w-[90%] mx-auto mt-28 lg:mt-56 text-primary md:text-center">
        From Application to Installation, <br /> We've Simplified the Solar Journey
      </h2>
      <p className="text-gray-500 text-left w-[85%] mt-9 mx-auto md:text-center">
        Whether you're an installer or a homeowner, we’ve streamlined the entire journey to ensure that switching to
        clean, renewable energy is hassle-free and efficient.
      </p>

      <div className="grid lg:grid-cols-2 gap-10 mt-20 w-[90%] md:w-[80%] lg:w-full mx-auto">
        {journey.map((d, i) => {
          return (
            <div key={i} className="relative bg-[#F0F2F5] rounded-2xl h-[471px] px-6 py-8">
              <h3 className="text-primary text-xl font-medium">{d.title}</h3>
              <p className="text-[#5E5E5E] font-light mt-3">{d.desc}</p>
              <img className="absolute bottom-0 left-1/2 -translate-x-1/2" src={d.image} alt={d.title} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SimplifiedJourney;
