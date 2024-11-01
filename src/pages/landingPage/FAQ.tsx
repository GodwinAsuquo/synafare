import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'How does the financing process work?',
    answer:
      'Once registered as a partner, you can apply for financing on behalf of your customers. We process each request, pay the distributor directly, and the products are shipped to you, ready for installation.',
  },
  {
    question: 'What is the minimum and maximum loan amount available?',
    answer: 'Loan amounts range from ₦500,000 to ₦10,000,000 per business, depending on eligibility.',
  },
  {
    question: 'What is the interest rate, and how is it applied?',
    answer:
      'The interest rate varies based on the financed asset type, term length, and risk profile. Rates are applied to the total value of the financed assets and are disclosed during the application process.',
  },
  {
    question: 'How do I receive products once financing is approved?',
    answer:
      'After approval, we pay the distributor directly, who will then deliver the products to you, ensuring you have the equipment needed.',
  },
  {
    question: 'Can I receive cash instead of products?',
    answer:
      'No, financing is strictly product-based. Payments are made directly to distributors, so you receive only the necessary products for installation.',
  },
  {
    question: 'Who is responsible for collecting loan repayments?',
    answer:
      "As the installer partner, you'll handle collections from your customers. We'll equip you with tools to streamline and manage this repayment process.",
  },
  {
    question: 'What business tools do you provide to support my operations?',
    answer: `We offer a suite of business tools, including:

• CRM Tools: Manage customer relationships and track interactions.
• Lead Generation Services: Find new customers to grow your business.
• Business Analytics: Access insights and data to improve your operations and track growth.`,
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id='faq' className="mt-32 lg:mt-48 mx-auto w-[90%] md:w-[80%] max-w-7xl">
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
              <p className="pb-6 text-black/70 text-base font-light whitespace-pre-line">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
