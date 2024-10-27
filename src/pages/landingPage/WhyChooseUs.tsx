import Button from '../../components/shared/Button';
import { whyChooseUs } from '../../utils/constants';

const WhyChooseUs = () => {
  return (
    <div id="why-choose-us">
      <h2 className="text-center text-primary font-semibold text-4xl">Why Choose Us?</h2>

      <div className="mt-16 lg:mt-28">
        {whyChooseUs.map((d, i) => {
          return (
            <div key={i} className="py-32" style={{ backgroundColor: `${d.bgColor}` }}>
              <div
                className={`${
                  i % 2 === 0 ? '' : 'flex-row-reverse'
                } mx-auto w-[90%] md:w-[50%] lg:w-[70%] max-w-7xl lg:flex items-center space-y-10 lg:space-y-0`}
              >
                <img
                  data-aos="fade-up"
                  src={d.image}
                  alt="Associate Installer"
                  className={`w-[380px] ${i % 2 === 0 ? 'lg:mr-32' : 'lg:ml-32'}`}
                />
                <div className="space-y-8 lg:space-y-12">
                  <div>
                    <p data-aos="fade-up" className="text-sm" style={{ color: `${d.textColor}` }}>
                      {d.subtitle}
                    </p>
                    <h3 data-aos="fade-up" className="text-3xl font-medium mt-2">
                      {d.title}
                    </h3>
                  </div>
                  <p data-aos="fade-up" className="text-gray-500 text-lg font-light">
                    {d.description}
                  </p>
                  <div data-aos="fade-up">
                    <Button />
                  </div>
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
