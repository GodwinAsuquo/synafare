import BecomePartnerButton from "../../components/shared/BecomePartnerButton";

const PreFooter = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="text-center mt-44 mb-32 mx-auto w-[90%] md:w-[70%] lg:w-[50%] max-w-7xl space-y-7"
    >
      <h1 className="text-4xl lg:text-5xl font-semibold">Join the Synafare Network Today</h1>
      <p className="text-500 font-light text-lg text-center">
        Ready to elevate your business with flexible financing for sustainable energy products? Partner with Synafare to
        access competitive product financing and dedicated support. Contact us today to learn more!
      </p>
      {/* <button className="px-3 py-2 text-sm border rounded-lg border-primary text-primary">
        <a href="https://zdsineyv.forms.app/synafare-registration-form" target="_blank" rel="noopener noreferrer">
          Get Started for Free
        </a>
      </button> */}

      <BecomePartnerButton />
    </div>
  );
};

export default PreFooter;
