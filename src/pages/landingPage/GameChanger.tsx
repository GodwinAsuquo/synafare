import flexible from '../../assets/icons/flexible.svg';
import streamlined from '../../assets/icons/streamlined.svg';
import visibility from '../../assets/icons/visibility.svg';

const features = [
  {
    title: 'Flexible Financing',
    description: 'We provide tailored solar financing options.',
    icon: flexible,
  },
  {
    title: 'Streamlined Operations',
    description: 'Efficient tools for managing your business',
    icon: streamlined,
  },
  {
    title: 'Enhanced Visibility',
    description: 'Connect with more customers through our platform.',
    icon: visibility,
  },
];

const GameChanger = () => {
  return (
    <section className="w-[80%] mt-44 mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-medium w-[35%] text-primary">Why Synafare is Your Solar Game-Changer</h2>
        <p className="text-xl w-[55%] font-light">
          We make solar energy accessible, offering tailored financing and support to meet the needs of both installers
          and customers
        </p>
      </div>

      <div className="grid grid-cols-3 gap-x-28 mt-36">
        {features.map((d, i) => {
          return (
            <div key={i} className="space-y-8">
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
