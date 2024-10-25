import Button from '../../components/shared/Button';
import { whyChooseUs } from '../../utils/constants';

const WhyChooseUs = () => {
  return (
    <div>
      <h2 className="text-center text-primary font-semibold text-4xl">Why Choose Us?</h2>

      <div className="mt-28">
        {whyChooseUs.map((d, i) => {
          return (
            <div key={i} className="py-32" style={{ backgroundColor: `${d.bgColor}` }}>
              <div key={i} className={`${i % 2 === 0 ? '' : 'flex-row-reverse'} mx-auto w-[70%] flex items-center`}>
                <img
                  src={d.image}
                  alt="Associate Installer"
                  className={`w-[380px] ${i % 2 === 0 ? 'mr-32' : 'ml-32'}`}
                />
                <div className="space-y-8">
                  <div>
                    <p className="text-sm" style={{ color: `${d.textColor}` }}>
                      {d.subtitle}
                    </p>
                    <h3 className="text-3xl font-medium mt-2">{d.title}</h3>
                  </div>
                  <p className="text-gray-500 text-lg font-light">{d.description}</p>
                  <Button />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyChooseUs;
