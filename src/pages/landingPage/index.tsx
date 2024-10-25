import AppLayout from '../../layouts/AppLayout';
import BecomeAPartner from './BecomeAPartner';
import Clientele from './Clientele';
import Faq from './FAQ';
import GameChanger from './GameChanger';
import Hero from './Hero';
import PreFooter from './PreFooter';
import SimplifiedJourney from './SimplifiedJourney';
import Testimonial from './Testimonial';
import WhyChooseUs from './WhyChooseUs';

const LandingPage = () => {
  return (
    <AppLayout>
      <Hero />
      <Clientele />
      <BecomeAPartner />
      <WhyChooseUs />
      <GameChanger />
      <SimplifiedJourney />
      <Testimonial />
      <Faq />
      <PreFooter />
    </AppLayout>
  );
};

export default LandingPage;
