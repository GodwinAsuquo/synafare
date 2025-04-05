import growatt from '../assets/images/clienteleLogos/growatt.svg';
import purity from '../assets/images/clienteleLogos/purity.svg';
import scorpion from '../assets/images/clienteleLogos/scorpion.svg';
import simbagroup from '../assets/images/clienteleLogos/simbagroup.svg';
import solarspark from '../assets/images/clienteleLogos/solarspark.svg';
import sygnite from '../assets/images/clienteleLogos/sygnite.svg';
import wersolution from '../assets/images/clienteleLogos/wersolution.svg';
import faster from '../assets/icons/faster.svg';
import fees from '../assets/icons/fees.svg';
import successful from '../assets/icons/successful.svg';
import thumb from '../assets/icons/thumb.svg';
import trackPayment from '../assets/images/trackPayment.png';
import hassleFree from '../assets/images/hassleFree.png';
import stayUpdated from '../assets/images/stayUpdated.png';
import facebook from '../assets/icons/socialMedia/facebook.svg';
import instagram from '../assets/icons/socialMedia/instagram.svg';
import linkedIn from '../assets/icons/socialMedia/linkedIn.svg';
import twitter from '../assets/icons/socialMedia/twitter.svg';
import { PATHS } from './enum';



export const clienteleLogos = [growatt, purity, scorpion, simbagroup, solarspark, sygnite, wersolution];

export const takeChargeData = [
  {
    title: 'Search & Discover',
    description:
      'Explore Synafare’s range of solar financing options. Find the solution that matches your needs and goals.',
  },
  {
    title: 'Plan Your Financing',
    description:
      'Select a flexible financing plan with terms that suit you. Choose from various durations and make your first payment to begin.',
  },
  {
    title: 'Get Your Equipment at 30%',
    description: 'Once you reach 30% of your financing, we’ll deliver your solar equipment before full payment.',
  },
];

export const socialProof = [
  { icon: faster, metric: '4x', desc: 'Faster project financing than traditional lenders.' },
  { icon: successful, metric: '80%', desc: 'Successful installations for partnered businesses.' },
  { icon: fees, metric: '₦0.00', desc: 'No fees on all financing transactions.' },
  { icon: thumb, metric: '70%', desc: 'Higher customer retention rate for certified installers.' },
];

export const whyChooseUs = [
  {
    id: 1,
    title: 'Reliable Support & Partnership',
    description:
      'Synafare partners closely with clients, offering dedicated support, resources, and guidance to help you achieve your business goals.',
    image: hassleFree,
    bgColor: '#F1F8FF',
    textColor: '#1671D9',
  },
  {
    id: 2,
    title: 'Specialized Energy Focus',
    description:
      'With a focus on the solar, inverter, and battery market, Synafare offers financing expertise that understands the unique needs of the energy sector.',
    image: stayUpdated,
    bgColor: '#FFFFFF',
    textColor: '#0F973D',
  },
  {
    id: 3,
    title: 'Flexible Financing Plans',
    description: `Synafare provides adaptable financing options, allowing
businesses to choose plans that align with their cash flow and growth targets.`,
    image: trackPayment,
    bgColor: '#FFFAF0',
    textColor: '#0F973D',
  },
];

export const testimonials = [
  {
    quote: `Synafare’s financing options allowed us to expand our offerings without worrying about cash
flow. The team’s support has been invaluable in growing our business.`,
    name: 'Holet Power Solutions',
    role: 'Solar Installer',
  },
  {
    quote: `With Synafare, we were able to stock premium solar products that our clients trust, while
managing our finances better. The seamless onboarding made it easy to get started!`,
    name: 'Solar Spark',
    role: 'Distributor',
  },
  {
    quote:
      'Synafare helped us grow our solar installation business by providing the financing we needed. Their platform made everything seamless.',
    name: 'Scripion Energy',
    role: 'Installer & Retailer',
  },
  {
    quote: `Synafare is a true partner in the energy industry. Their financing and training resources
have helped us meet increasing demand while ensuring smooth operations.`,

    name: 'Sygnite',
    role: 'Distributor',
  },
];

export const navLinks = [
  {
    title: 'Our Solution',
    route: '/',
    id: 'our-solution',
  },
  {
    title: 'Solar Packages',
    route: PATHS.PACKAGES,
    id: '',
  },
  {
    title: 'Why choose us',
    route: '/',
    id: 'why-choose-us',
  },
  {
    title: 'Testimonials',
    route: '/',
    id: 'testimonial',
  },
];

export const socialLinks = [
  {
    platform: 'Twitter',
    url: 'https://twitter.com/synafare',
    icon: twitter,
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/synafare',
    icon: instagram,
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/company/synafare',
    icon: linkedIn,
  },
  {
    platform: 'Facebook',
    url: 'https://facebook.com/synafare',
    icon: facebook,
  },
];
