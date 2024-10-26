import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'What types of solar projects does Synafare finance?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'How do I apply for solar financing with Synafare?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'What are the typical terms for solar financing?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'How quickly can I get approved for financing?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'Does Synafare only work with solar installers?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'Are there any hidden fees?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'Can I track the progress of my solar project?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'What happens if I miss a payment?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
  {
    question: 'How does Synafare support solar installers?',
    answer:
      'Simply sign up on our platform, complete the short application, and submit your project details for quick approval.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-32 lg:mt-48 mx-auto w-[90%] md:w-[80%] max-w-7xl">
      <h3 data-aos="fade-up" className="text-left md:text-center text-3xl font-semibold text-primary">
        Frequently Asked Questions
      </h3>
      <p data-aos="fade-up" className="text-left md:text-center mt-3 lg:w-[50%] mx-auto text-primary font-light">
        Giving answers to all the questions you might possibly have. If you still have questions, do reach out to us
      </p>

      <div className=" mx-auto px-4 py-8 mt-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-400">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-[#101828]">{faq.question}</span>
              <span className="ml-6 flex-shrink-0 text-primary">
                {openIndex === index ? <MdKeyboardArrowUp size={30} /> : <MdKeyboardArrowDown size={30} />}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <p className="pb-6 text-black/70 text-base font-light">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
