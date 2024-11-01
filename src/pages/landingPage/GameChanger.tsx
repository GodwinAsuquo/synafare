import flexible from '../../assets/icons/flexible.svg';
import streamlined from '../../assets/icons/streamlined.svg';
import visibility from '../../assets/icons/visibility.svg';

const features = [
  {
    title: 'Flexible Financing for Growth',
    description:
      'Whether you’re an installer looking to scale your services or a distributor expanding your inventory, Synafare’s financing options let you grow on your terms. We provide flexible, tailored financing plans to keep your business moving forward without cash flow interruptions.',
    icon: flexible,
  },
  {
    title: 'Access to Premium Energy Solutions',
    description:
      'Synafare gives you access to top-of-the-line solar panels, inverters, and batteries, enabling you to provide your clients with reliable, sustainable energy solutions. Our network ensures that your business has high-quality products that are built to perform and last.',
    icon: streamlined,
  },
  {
    title: 'Simplified Onboarding & Partnership Process',
    description:
      'Getting started with Synafare is straightforward. We’ve designed our onboarding and financing processes to be seamless, ensuring you can quickly access the products and support you need. From initial setup to ongoing financing management, we make it easy for you to succeed.',
    icon: visibility,
  },
];

const GameChanger = () => {
  return (
    <section className="w-[90%] md:w-[80%] max-w-7xl mt-24  lg:mt-44 mx-auto">
      <div className="lg:flex justify-between items-center">
        <h2 data-aos="fade-up" className="text-3xl lg:text-4xl font-medium md:w-1/2 lg:w-[35%] text-primary">
          Why Synafare is Your Solar Game-Changer
        </h2>
        <p data-aos="fade-up" className="text-xl  lg:w-[55%] font-light text-gray-500 mt-5 lg:mt-0">
          We make solar energy accessible, offering tailored financing and support to meet the needs of both installers
          and customers
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-20 mt-24 lg:mt-36">
        {features.map((d, i) => {
          return (
            <div data-aos="zoom-in-down" key={i} className="flex flex-col justify-between space-y-8">
              <img src={d.icon} alt={d.title} className="w-14" />
              <h4 className="text-xl font-medium">{d.title}</h4>
              <p className="text-lg font-light text-gray-500">{d.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GameChanger;
