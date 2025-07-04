import React, { useEffect, useRef, useState } from 'react';
import '../../../public/css/ZohoFormStyles.css';
import { Link } from 'react-router-dom';

// Extend React's TypeScript definitions using interface augmentation
declare module 'react' {
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    checktype?: string;
    fieldType?: number | string;
    compname?: string;
    phoneFormat?: string;
    isCountryCodeEnabled?: boolean;
    valType?: string;
    phoneFormatType?: string;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    checktype?: string;
    fieldType?: number | string;
    compname?: string;
    phoneFormat?: string;
    isCountryCodeEnabled?: boolean;
    valType?: string;
    phoneFormatType?: string;
  }
}

// Add global type to Window for Zoho validation function
declare global {
  interface Window {
    zf_ValidateAndSubmit?: () => boolean;
    zf_MandArray?: string[];
    updateMandatoryFields?: () => void;
  }
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  financeType?: string;
  fileUpload?: string;
  submitError?: string;
  customerName?: string;
  customerBvn?: string;
  totalInvoiceFee?: string;
  downpayment?: string;
  financeDuration?: string;
}

const FinanceRequestForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const errorRef = useRef<HTMLDivElement>(null);

  // Form input states
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  // Business details
  const [financeType, setFinanceType] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [CustomerBvn, setCustomerBvn] = useState('');
  const [totalInvoiceFee, setTotalInvoiceFee] = useState<number>(0);
  const [invoiceFeeFormatted, setInvoiceFeeFormatted] = useState<string>(''); // For displaying formatted value
  const [downpayment, setDownpayment] = useState<number>(0);
  const [downPaymentFormatted, setDownPaymentFormatted] = useState<string>(''); // For displaying formatted value
  const [financeDuration, setFinanceDuration] = useState('6 Months'); // Default to 6 Months
  const [monthlyPayment, setMonthlyPayment] = useState<string>('0');

   
  useEffect(() => {
    // Dynamically load the validation script
    const script = document.createElement('script');
    script.src = '/js/validation.js';
    script.async = true;
    script.onload = () => {
      if (window.zf_MandArray) {
        // Create a function with no parameters
        window.updateMandatoryFields = () => {
          const mandatoryFields = [
            'Name_First',
            'Name_Last',
            'SingleLine', // Company Name
            'Dropdown3', // Financing Purpose (Inventory Financing or Installation Project)
            'FileUpload', // Invoice upload
            'Number', // Total Invoice Fee
            'Number1', // Downpayment
            'Dropdown1', // Financing Duration
          ];

          // Conditionally required fields for "Installation Project"
          if (financeType === 'Installation Project') {
            mandatoryFields.push(
              'SingleLine1', // Customer Name
              'SingleLine2' // Customer BVN
            );
          }

          // Update Zoho's mandatory field array
          window.zf_MandArray = mandatoryFields;
          console.log('Updated zf_MandArray:', window.zf_MandArray);
        };

        // Initialize
        window.updateMandatoryFields();
      }
    };
    document.body.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [financeType]);

  // Calculate monthly payment based on repayment period and down payment
  useEffect(() => {
    if (
      totalInvoiceFee > 0 &&
      downpayment !== undefined &&
      downpayment >= 0 &&
      financeDuration &&
      financeDuration !== '-Select-'
    ) {
      const months = parseInt(financeDuration) || 6;
      const remainingAmount = totalInvoiceFee - downpayment;
      const interestRate = 0.05; // Updated to 5%
      const monthlyPaymentValue = remainingAmount / months;
      const interest = remainingAmount * interestRate;
      const monthlyPaymentValueWithInterest = Math.round(monthlyPaymentValue + interest);
      setMonthlyPayment(monthlyPaymentValueWithInterest.toLocaleString());
    } else {
      setMonthlyPayment('0');
    }
  }, [totalInvoiceFee, downpayment, financeDuration]);

  useEffect(() => {
    if (generalError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      errorRef.current.focus();
    }
  }, [generalError]);

  const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    let missingRequiredFields = false;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!companyName.trim()) {
      errors.companyName = 'Company name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!financeType || financeType === '-Select-') {
      errors.financeType = 'Please select your business type';
      isValid = false;
      missingRequiredFields = true;
    }

    if (financeType === 'Installation Project') {
      if (!customerName.trim()) {
        errors.customerName = "Customer's name is required";
        isValid = false;
        missingRequiredFields = true;
      }
      if (!CustomerBvn) {
        errors.customerBvn = "Customer's BVN is required";
        isValid = false;
        missingRequiredFields = true;
      } else if (CustomerBvn.length !== 11 || !/^\d+$/.test(CustomerBvn)) {
        errors.customerBvn = 'BVN must be an 11-digit number';
        isValid = false;
      }
    }

    if (totalInvoiceFee <= 0 || isNaN(totalInvoiceFee)) {
      errors.totalInvoiceFee = 'Total invoice fee must be a valid positive number';
      isValid = false;
      missingRequiredFields = true;
    }

    if (downpayment <= 0 || isNaN(downpayment)) {
      errors.downpayment = 'Downpayment must be a valid positive number';
      isValid = false;
      missingRequiredFields = true;
    } else if (totalInvoiceFee > 0) {
      const minDownPayment = Math.round(totalInvoiceFee * 0.3);
      if (downpayment < minDownPayment) {
        errors.downpayment = `Down payment must be at least ₦${formatNumberWithCommas(minDownPayment)}`;
        isValid = false;
      } else if (downpayment > totalInvoiceFee) {
        errors.downpayment = `Down payment cannot exceed package price ₦${formatNumberWithCommas(totalInvoiceFee)}`;
        isValid = false;
      }
    }

    if (!financeDuration || financeDuration === '-Select-') {
      errors.financeDuration = 'Please select a financing duration';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!fileInputRef.current?.files?.length) {
      errors.fileUpload = 'Please upload your invoice (PDF, max 5MB)';
      isValid = false;
      missingRequiredFields = true;
    }

    setFormErrors(errors);
    setGeneralError(missingRequiredFields ? 'Please fill in all required fields marked with *' : '');

    return isValid;
  };
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, validating...');

   

    if (!validateForm()) {
      console.log('Validation failed, scrolling to error');
      if (errorRef.current) {
        const headerOffset = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = errorRef.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        errorRef.current.focus();
      } else {
        console.log('Error ref not found, scrolling to top');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (window.zf_ValidateAndSubmit && !window.zf_ValidateAndSubmit()) {
      setGeneralError('Please correct the errors in the form.');
      setIsSubmitting(false);
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        errorRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');
    setFormErrors({ ...formErrors, submitError: undefined });

    try {
      formRef.current?.submit();
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setFormErrors({
        ...formErrors,
        submitError: 'An error occurred while submitting the form. Please try again.',
      });
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        errorRef.current.focus();
      }
    }
  };

  // Handle file selection with validation for file type and size
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        event.target.value = '';
        setFileName('');
        setFormErrors({ ...formErrors, fileUpload: 'Please upload a PDF file only.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        event.target.value = '';
        setFileName('');
        setFormErrors({ ...formErrors, fileUpload: 'File size exceeds 5MB limit.' });
        return;
      }
      setFileName(file.name);
      setFormErrors({ ...formErrors, fileUpload: undefined });
    } else {
      setFileName('');
      setFormErrors({ ...formErrors, fileUpload: 'Please upload your invoice (PDF, max 5MB)' });
    }
  };

  // Input change handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (formErrors.firstName && value.trim()) {
      setFormErrors({ ...formErrors, firstName: undefined });
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (formErrors.lastName && value.trim()) {
      setFormErrors({ ...formErrors, lastName: undefined });
    }
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyName(value);
    if (formErrors.companyName && value.trim()) {
      setFormErrors({ ...formErrors, companyName: undefined });
    }
  };

  // Dropdown handlers
  const handleFinanceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFinanceType(value);
    setCustomerName('');
    setCustomerBvn('');
    // setTotalInvoiceFee(0);
    // setDownpayment(0);
    // setFinanceDuration('');
    const updatedErrors = { ...formErrors };
    delete updatedErrors.financeType;
    delete updatedErrors.customerName;
    delete updatedErrors.customerBvn;
    // delete updatedErrors.totalInvoiceFee;
    // delete updatedErrors.downpayment;
    // delete updatedErrors.financeDuration;
    setFormErrors(updatedErrors);
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerName(value);
    if (formErrors.customerName && value.trim()) {
      setFormErrors({ ...formErrors, customerName: undefined });
    }
  };

  const handleCustomerBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerBvn(value);
    if (formErrors.customerBvn && value) {
      setFormErrors({ ...formErrors, customerBvn: undefined });
    }
  };

  const handleTotalInvoiceFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setTotalInvoiceFee(0);
      setInvoiceFeeFormatted('0');
      setFormErrors({ ...formErrors, totalInvoiceFee: 'Total invoice fee is required' });
      return;
    }
    const numValue = parseInt(value, 10);


    setTotalInvoiceFee(numValue);
    setInvoiceFeeFormatted(formatNumberWithCommas(numValue));

    if (formErrors.totalInvoiceFee && value) {
      setFormErrors({ ...formErrors, totalInvoiceFee: undefined });
    }

    console.log(`Total Invoice Fee changed: ${numValue}`, typeof(numValue));
    console.log(`Invoice Fee Formatted: ${invoiceFeeFormatted}`, typeof(invoiceFeeFormatted));
    
  };

  const handleDownpaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setDownpayment(0);
      setDownPaymentFormatted('0');
      setFormErrors({ ...formErrors, downpayment: 'Down payment is required' });
      return;
    }
    const numValue = parseInt(value, 10);
   
    setDownpayment(numValue);
    setDownPaymentFormatted(formatNumberWithCommas(numValue));

    


    if (formErrors.downpayment) {
      setFormErrors({ ...formErrors, downpayment: undefined });
    }
    if (totalInvoiceFee > 0) {
      const minDownPayment = Math.round(totalInvoiceFee * 0.3);
      if (numValue < minDownPayment) {
        setFormErrors({
          ...formErrors,
          downpayment: `Down payment must be at least ₦${formatNumberWithCommas(minDownPayment)}`,
        });
      } else if (numValue > totalInvoiceFee) {
        setFormErrors({
          ...formErrors,
          downpayment: `Down payment cannot exceed package price ₦${formatNumberWithCommas(totalInvoiceFee)}`,
        });
      }
    }
    
     
    
  };

  const handleFinanceDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFinanceDuration(value);
    if (formErrors.financeDuration && value !== '-Select-') {
      setFormErrors({ ...formErrors, financeDuration: undefined });
    }
  };

  return (
    <div className="pt-10 md:pt-20 md:w-[60%] lg:w-[40%]  mx-auto">
      <h1 className="text-center text-[#344054] text-xl md:text-2xl mt-16 lg:mt-10 font-semibold">
        Synafare Finance Request Form
      </h1>

      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6 mt-4" role="alert">
        <strong className="font-semibold">Note:</strong> Only partners can request for finance.{' '}
        <Link to="/partner-registration-form" className="underline font-medium text-blue-700 hover:text-blue-900">
          Not a partner yet? Click here.
        </Link>
      </div>

      <div className="zf-templateWidth">
        {/* General Error Message */}
        {generalError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4 relative"
            role="alert"
            ref={errorRef}
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}

        <form
          ref={formRef}
          action="https://forms.zohopublic.eu/segunsyna1/form/SynafareRequestForm/formperma/J1joofOHwUKkuFhN0WDR4Hkj2ie7LtzlI5sb55xketI/htmlRecords/submit"
          name="form"
          method="POST"
          onSubmit={handleSubmit}
          acceptCharset="UTF-8"
          encType="multipart/form-data"
          id="form"
          className="bg-white"
        >
          <input type="hidden" name="zf_referrer_name" value="" />
          <input type="hidden" name="zf_redirect_url" value="" />
          <input type="hidden" name="zc_gad" value="" />

          <div className="zf-templateWrapper">
            <div className="zf-subContWrap zf-topAlign">
              <ul>
                {/* Name Fields */}
                <li className="zf-tempFrmWrapper zf-name zf-namelarge">
                  <label className="zf-labelName">
                    Your Name
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv zf-twoType">
                    <div className="zf-nameWrapper">
                      <span>
                        <input
                          type="text"
                          maxLength={255}
                          name="Name_First"
                          fieldType={7}
                          placeholder=""
                          value={firstName}
                          onChange={handleFirstNameChange}
                          className={formErrors.firstName ? 'border-red-500' : ''}
                        />
                        <label>First Name</label>
                      </span>
                      <span>
                        <input
                          type="text"
                          maxLength={255}
                          name="Name_Last"
                          fieldType={7}
                          placeholder=""
                          value={lastName}
                          onChange={handleLastNameChange}
                          className={formErrors.lastName ? 'border-red-500' : ''}
                        />
                        <label>Last Name</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                    <p
                      className="zf-errorMessage"
                      style={{ display: formErrors.firstName || formErrors.lastName ? 'block' : 'none' }}
                    >
                      {formErrors.firstName || formErrors.lastName}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Company Name */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Your Company Name
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="SingleLine"
                        checktype="c1"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                        maxLength={255}
                        fieldType={1}
                        placeholder=""
                        className={formErrors.companyName ? 'border-red-500' : ''}
                      />
                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.companyName ? 'block' : 'none' }}>
                      {formErrors.companyName}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Finance Type */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    What is the financing request for?
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.financeType ? 'border-red-500' : ''}`}
                      name="Dropdown3"
                      checktype="c1"
                      value={financeType}
                      onChange={handleFinanceTypeChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="Inventory Financing">Inventory Financing</option>
                      <option value="Installation Project">Installation Project</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.financeType ? 'block' : 'none' }}>
                      {formErrors.financeType}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {financeType === 'Installation Project' && (
                  <>
                    {/* Customer Name */}
                    <li className="zf-tempFrmWrapper zf-large">
                      <label className="zf-labelName">
                        Customer's Name
                        <em className="zf-important">*</em>
                      </label>
                      <div className="zf-tempContDiv">
                        <span>
                          <input
                            type="text"
                            name="SingleLine1"
                            checktype="c1"
                            value={customerName}
                            onChange={handleCustomerNameChange}
                            maxLength={255}
                            fieldType={1}
                            placeholder=""
                            className={formErrors.customerName ? 'border-red-500' : ''}
                          />
                        </span>
                        <p className="zf-errorMessage" style={{ display: formErrors.customerName ? 'block' : 'none' }}>
                          {formErrors.customerName}
                        </p>
                      </div>
                      <div className="zf-clearBoth"></div>
                    </li>

                    {/* Customer BVN */}
                    <li className="zf-tempFrmWrapper zf-large">
                      <label className="zf-labelName">
                        Customer's BVN
                        <em className="zf-important">*</em>
                      </label>
                      <div className="zf-tempContDiv">
                        <span>
                          <input
                            type="text"
                            name="SingleLine2"
                            checktype="c2"
                            value={CustomerBvn}
                            inputMode="numeric"
                            onChange={handleCustomerBvnChange}
                            maxLength={11}
                            fieldType={1}
                            placeholder=""
                            className={formErrors.customerBvn ? 'border-red-500' : ''}
                          />
                        </span>
                        <p className="zf-errorMessage" style={{ display: formErrors.customerBvn ? 'block' : 'none' }}>
                          {formErrors.customerBvn}
                        </p>
                      </div>
                      <div className="zf-clearBoth"></div>
                    </li>
                  </>
                )}

                {/* Total Invoice Fee */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Total Invoice Fee
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700">₦</span>
                      <input
                        type="text" // Changed to text to support formatted input
                        // name="Number"
                        checktype="c1"
                        value={invoiceFeeFormatted}
                        onChange={handleTotalInvoiceFeeChange}
                        maxLength={18}
                        fieldType={1}
                        placeholder=""
                        style={{ padding: '0.625rem 1.7rem' }}
                        className={formErrors.totalInvoiceFee ? 'border-red-500' : ''}
                      />
                      <input type="hidden" name="Number" value={totalInvoiceFee} />
                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.totalInvoiceFee ? 'block' : 'none' }}>
                      {formErrors.totalInvoiceFee}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Downpayment */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    How much downpayment? (minimum of 30% of your selected package is required)
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700">₦</span>
                      <input
                        type="text"
                        // name="Number1"
                        checktype="c1"
                        value={downPaymentFormatted}
                        onChange={handleDownpaymentChange}
                        maxLength={18}
                        fieldType={1}
                        placeholder=""
                        style={{ padding: '0.625rem 1.7rem' }}
                        className={formErrors.downpayment ? 'border-red-500' : ''}
                      />
                      <input type="hidden" name="Number1" value={downpayment} />

                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.downpayment ? 'block' : 'none' }}>
                      {formErrors.downpayment}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Duration of Financing */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    What is the duration of the financing? (Max of 6 Months)
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.financeDuration ? 'border-red-500' : ''}`}
                      name="Dropdown1"
                      checktype="c1"
                      value={financeDuration}
                      onChange={handleFinanceDurationChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                      <option value="4 Months">4 Months</option>
                      <option value="5 Months">5 Months</option>
                      <option value="6 Months">6 Months</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.financeDuration ? 'block' : 'none' }}>
                      {formErrors.financeDuration}
                    </p>
                  </div>
                  <p className="zf-instruction">We charge a fixed interest of 5% monthly</p>
                  {downpayment > 0 && financeDuration && financeDuration !== '-Select-' && (
                    <div className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                      <p className="font-medium">
                        Your monthly payment: ₦{monthlyPayment}/month for {financeDuration}
                      </p>
                    </div>
                  )}
                  <div className="zf-clearBoth"></div>
                </li>

                {/*Upload Invoice*/}
                <li className="zf-tempFrmWrapper">
                  <label className="block text-[#101928] font-medium mb-2">
                    Upload Invoice
                    <em className="zf-important">*</em>
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center cursor-pointer border border-dashed rounded-lg px-4 py-8 hover:bg-gray-50 ${
                      formErrors.fileUpload ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="bg-[#F0F2F5] rounded-full p-3 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">Upload Your Invoice</h3>
                      <p className="text-gray-500 text-sm">PDF format • Max. 5MB</p>
                      {fileName && <div className="mt-2 text-sm text-green-600 w-52 truncate">{fileName}</div>}
                    </div>

                    <input
                      type="file"
                      id="invoiceUpload"
                      name="FileUpload"
                      checktype="c1"
                      accept=".pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </div>

                  <p
                    className="text-red-500 text-sm mt-1"
                    style={{ display: formErrors.fileUpload ? 'block' : 'none' }}
                  >
                    {formErrors.fileUpload}
                  </p>
                  <div className="zf-clearBoth"></div>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <ul>
              <li className="zf-fmFooter">
                <button
                  className={`zf-submitColor w-full relative ${
                    isSubmitting ? 'bg-yellow-300 hover:bg-yellow-300 cursor-wait' : 'bg-[#FEC601] hover:bg-yellow-400'
                  } text-black`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg
                        className="animate-spin h-5 w-5 my-[10px] text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>

                {/* Submit Error Message */}
                {formErrors.submitError && (
                  <div className="mt-2 text-red-500 text-sm text-center">{formErrors.submitError}</div>
                )}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceRequestForm;
