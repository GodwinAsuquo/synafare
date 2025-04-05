import React, { useEffect, useRef, useState } from 'react';
import '../../../public/css/ZohoFormStyles.css';

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
  phone?: string;
  email?: string;
  bvn?: string;
  businessName?: string;
  registrationNumber?: string;
  address?: string;
  businessType?: string;
  installations?: string;
  installationCost?: string;
  monthlySales?: string;
  guarantor?: string;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
  fileUpload?: string;
  submitError?: string;
}

const PartnerRegistrationForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Form input states
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bvn, setBvn] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');

  // Address fields
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [country, setCountry] = useState<string>('Nigeria');

  // Business details
  const [businessType, setBusinessType] = useState<string>('');
  const [monthlyInstallations, setMonthlyInstallations] = useState<string>('');
  const [installationCost, setInstallationCost] = useState<string>('');
  const [monthlySales, setMonthlySales] = useState<string>('');
  const [canProvideGuarantor, setCanProvideGuarantor] = useState<string>('');

  // Guarantor fields
  const [guarantorFirstName, setGuarantorFirstName] = useState<string>('');
  const [guarantorLastName, setGuarantorLastName] = useState<string>('');
  const [guarantorPhone, setGuarantorPhone] = useState<string>('');
  const [guarantorAddress, setGuarantorAddress] = useState<string>('');
  const [guarantorCity, setGuarantorCity] = useState<string>('');
  const [guarantorRegion, setGuarantorRegion] = useState<string>('');
  const [guarantorCountry, setGuarantorCountry] = useState<string>('Nigeria');

  const [question, setQuestion] = useState<string>('');

  useEffect(() => {
    // Dynamically load the validation script
    const script = document.createElement('script');
    script.src = '/js/validation.js';
    script.async = true;
    script.onload = () => {
      if (window.zf_MandArray) {
        // Create a function with no parameters
        window.updateMandatoryFields = () => {
          // Base required fields excluding FileUpload
          const mandatoryFields = [
            'Name_First',
            'Name_Last',
            'PhoneNumber_countrycode',
            'Number', // BVN
            'SingleLine', // Business name
            'SingleLine1', // Business registration number
            'Address_AddressLine1',
            'Address_City',
            'Address_Region',
            'Address_Country',
            'Dropdown3', // Business type
            'Dropdown', // Monthly installations
            'Dropdown1', // Installation cost
            'Dropdown4', // Monthly sales
            'Dropdown2', // Can provide guarantor
            'FileUpload', // Bank statements
          ];

          // Update global zf_MandArray
          window.zf_MandArray = mandatoryFields;
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
  }, []);

  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    let missingRequiredFields = false;

    // Validate first name
    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate last name
    if (!lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate phone
    if (!phoneNumber) {
      errors.phone = 'Phone number is required';
      isValid = false;
      missingRequiredFields = true;
    } else {
      // Basic phone validation
      if (phoneNumber.length < 10 || phoneNumber.length > 15) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate BVN
    if (!bvn) {
      errors.bvn = 'BVN is required';
      isValid = false;
      missingRequiredFields = true;
    } else if (bvn.length !== 11) {
      errors.bvn = 'BVN must be 11 digits';
      isValid = false;
    }

    // Validate business name
    if (!businessName) {
      errors.businessName = 'Business name is required';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate registration number
    if (!registrationNumber) {
      errors.registrationNumber = 'Registration number is required';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate address
    if (!streetAddress) {
      errors.address = 'Street address is required';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!city) {
      errors.address = errors.address || 'City is required';
      isValid = false;
      missingRequiredFields = true;
    }

    if (!region) {
      errors.address = errors.address || 'State/Region is required';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate business type
    if (!businessType || businessType === '-Select-') {
      errors.businessType = 'Please select your business type';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate monthly installations
    if (!monthlyInstallations || monthlyInstallations === '-Select-') {
      errors.installations = 'Please select your monthly installations';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate installation cost
    if (!installationCost || installationCost === '-Select-') {
      errors.installationCost = 'Please select your average installation cost';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate monthly sales
    if (!monthlySales || monthlySales === '-Select-') {
      errors.monthlySales = 'Please select your monthly sales';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate guarantor option
    if (!canProvideGuarantor || canProvideGuarantor === '-Select-') {
      errors.guarantor = 'Please select whether you can provide a guarantor';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate bank statement upload
    if (!fileInputRef.current?.files?.length) {
      errors.fileUpload = 'Please upload your bank statement';
      isValid = false;
      missingRequiredFields = true;
    }

    setFormErrors(errors);

    // Set general error message if required fields are missing
    if (missingRequiredFields) {
      setGeneralError('Please fill in all required fields marked with *');
    } else {
      setGeneralError('');
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // First perform client-side validation
    if (!validateForm()) {
      // Scroll to the general error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');
    setFormErrors({ ...formErrors, submitError: undefined });

    try {
      // Use native form submit to Zoho
      formRef.current?.submit();

      // Set a timeout to reset the submission state after a delay
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
    }
  };

  // Handle file selection with validation for file type and size
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;

    if (files && files[0]) {
      const file = files[0];

      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        event.target.value = '';
        setFileName('');
        setFormErrors({ ...formErrors, fileUpload: 'Please upload a PDF file only.' });
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        event.target.value = '';
        setFileName('');
        setFormErrors({ ...formErrors, fileUpload: 'File size exceeds 5MB limit.' });
        return;
      }

      setFileName(file.name);

      // Clear file upload error if exists
      if (formErrors.fileUpload) {
        setFormErrors({ ...formErrors, fileUpload: undefined });
      }
    }
  };

  // Input change handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (formErrors.firstName && value) {
      setFormErrors({ ...formErrors, firstName: undefined });
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (formErrors.lastName && value) {
      setFormErrors({ ...formErrors, lastName: undefined });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    if (formErrors.phone && value) {
      setFormErrors({ ...formErrors, phone: undefined });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (formErrors.email && value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormErrors({ ...formErrors, email: undefined });
    }
  };

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setBvn(value);
    if (formErrors.bvn && value) {
      setFormErrors({ ...formErrors, bvn: undefined });
    }
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessName(value);
    if (formErrors.businessName && value) {
      setFormErrors({ ...formErrors, businessName: undefined });
    }
  };

  const handleRegistrationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegistrationNumber(value);
    if (formErrors.registrationNumber && value) {
      setFormErrors({ ...formErrors, registrationNumber: undefined });
    }
  };

  // Address field handlers
  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStreetAddress(value);
    updateAddressErrorState(value, city, region);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    updateAddressErrorState(streetAddress, value, region);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegion(value);
    updateAddressErrorState(streetAddress, city, value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountry(value);
  };

  const updateAddressErrorState = (street: string, city: string, region: string) => {
    if (formErrors.address && street && city && region) {
      setFormErrors({ ...formErrors, address: undefined });
    }
  };

  // Dropdown handlers
  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBusinessType(value);
    if (formErrors.businessType && value !== '-Select-') {
      setFormErrors({ ...formErrors, businessType: undefined });
    }
  };

  const handleMonthlyInstallationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMonthlyInstallations(value);
    if (formErrors.installations && value !== '-Select-') {
      setFormErrors({ ...formErrors, installations: undefined });
    }
  };

  const handleInstallationCostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInstallationCost(value);
    if (formErrors.installationCost && value !== '-Select-') {
      setFormErrors({ ...formErrors, installationCost: undefined });
    }
  };

  const handleMonthlySalesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMonthlySales(value);
    if (formErrors.monthlySales && value !== '-Select-') {
      setFormErrors({ ...formErrors, monthlySales: undefined });
    }
  };

  const handleCanProvideGuarantorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCanProvideGuarantor(value);
    if (formErrors.guarantor && value !== '-Select-') {
      setFormErrors({ ...formErrors, guarantor: undefined });
    }
  };

  // Guarantor field handlers
  const handleGuarantorFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorFirstName(e.target.value);
  };

  const handleGuarantorLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorLastName(e.target.value);
  };

  const handleGuarantorPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorPhone(e.target.value.replace(/\D/g, ''));
  };

  const handleGuarantorAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorAddress(e.target.value);
  };

  const handleGuarantorCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorCity(e.target.value);
  };

  const handleGuarantorRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuarantorRegion(e.target.value);
  };

  const handleGuarantorCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuarantorCountry(e.target.value);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <div className="pt-10 md:pt-20 md:w-[60%] lg:w-[40%]  mx-auto">
      <h1 className="text-center text-[#344054] text-xl md:text-2xl mt-16 lg:mt-10 font-semibold">Synafare Partner Registration Form</h1>
      <div className="zf-templateWidth">
        {/* General Error Message */}
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}

        <form
          ref={formRef}
          action="https://forms.zohopublic.eu/segunsyna1/form/SynafarePartnerRegistrationForm/formperma/g23v5DvzQnCr33jdxaOmBUJmEJOfCdN6ALYI0uM7FbE/htmlRecords/submit"
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
                    Name
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

                {/* Phone */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Phone
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv zf-phonefld">
                    <div className="zf-phwrapper zf-phNumber">
                      <span>
                        <input
                          type="text"
                          compname="PhoneNumber"
                          name="PhoneNumber_countrycode"
                          maxLength={20}
                          checktype="c7"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          phoneFormat="1"
                          isCountryCodeEnabled={false}
                          fieldType={11}
                          id="international_PhoneNumber_countrycode"
                          placeholder=""
                          className={formErrors.phone ? 'border-red-500' : ''}
                        />
                        <label>Number</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                    <p className="zf-errorMessage" style={{ display: formErrors.phone ? 'block' : 'none' }}>
                      {formErrors.phone}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Email */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">Email</label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        fieldType={9}
                        type="text"
                        maxLength={255}
                        name="Email"
                        checktype="c5"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder=""
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.email ? 'block' : 'none' }}>
                      {formErrors.email}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* BVN */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    BVN
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="Number"
                        checktype="c2"
                        value={bvn}
                        onChange={handleBvnChange}
                        maxLength={18}
                        placeholder=""
                        className={formErrors.bvn ? 'border-red-500' : ''}
                      />
                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.bvn ? 'block' : 'none' }}>
                      {formErrors.bvn}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Business Name */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Business or Company Name
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="SingleLine"
                        checktype="c1"
                        value={businessName}
                        onChange={handleBusinessNameChange}
                        maxLength={255}
                        fieldType={1}
                        placeholder=""
                        className={formErrors.businessName ? 'border-red-500' : ''}
                      />
                    </span>
                    <p className="zf-errorMessage" style={{ display: formErrors.businessName ? 'block' : 'none' }}>
                      {formErrors.businessName}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Registration Number */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Business or Company Registration Number
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="SingleLine1"
                        checktype="c1"
                        value={registrationNumber}
                        onChange={handleRegistrationNumberChange}
                        maxLength={255}
                        fieldType={1}
                        placeholder=""
                        className={formErrors.registrationNumber ? 'border-red-500' : ''}
                      />
                    </span>
                    <p
                      className="zf-errorMessage"
                      style={{ display: formErrors.registrationNumber ? 'block' : 'none' }}
                    >
                      {formErrors.registrationNumber}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Address */}
                <li className="zf-tempFrmWrapper zf-address zf-addrlarge">
                  <label className="zf-labelName">
                    Address
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv zf-address">
                    <div className="zf-addrCont">
                      <span className="zf-addOne">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address_AddressLine1"
                          checktype="c1"
                          placeholder=""
                          value={streetAddress}
                          onChange={handleStreetAddressChange}
                          className={formErrors.address ? 'border-red-500' : ''}
                        />
                        <label>Street Address</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address_City"
                          checktype="c1"
                          placeholder=""
                          value={city}
                          onChange={handleCityChange}
                          className={formErrors.address ? 'border-red-500' : ''}
                        />
                        <label>City</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address_Region"
                          checktype="c1"
                          placeholder=""
                          value={region}
                          onChange={handleRegionChange}
                          className={formErrors.address ? 'border-red-500' : ''}
                        />
                        <label>State</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <select
                          className="zf-form-sBox"
                          name="Address_Country"
                          checktype="c1"
                          value={country}
                          onChange={handleCountryChange}
                        >
                          <option value="-Select-">-Select-</option>
                          {/* Including only Nigeria and a few other common options for brevity */}
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                        </select>
                        <label>Country</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                      <p className="zf-errorMessage" style={{ display: formErrors.address ? 'block' : 'none' }}>
                        {formErrors.address}
                      </p>
                    </div>
                  </div>
                  <div className="zf-eclearBoth"></div>
                </li>

                {/* Business Type */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    What is the primary nature of your solar business?
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.businessType ? 'border-red-500' : ''}`}
                      name="Dropdown3"
                      checktype="c1"
                      value={businessType}
                      onChange={handleBusinessTypeChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="Installer">Installer</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.businessType ? 'block' : 'none' }}>
                      {formErrors.businessType}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Monthly Installations */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    How many installations do you do per month?
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.installations ? 'border-red-500' : ''}`}
                      name="Dropdown"
                      checktype="c1"
                      value={monthlyInstallations}
                      onChange={handleMonthlyInstallationsChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="1 - 10">1 - 10</option>
                      <option value="10 - 30">10 - 30</option>
                      <option value="30 - 60">30 - 60</option>
                      <option value="60 - 100">60 - 100</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.installations ? 'block' : 'none' }}>
                      {formErrors.installations}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Installation Cost */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    What is your average cost per installation?
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.installationCost ? 'border-red-500' : ''}`}
                      name="Dropdown1"
                      checktype="c1"
                      value={installationCost}
                      onChange={handleInstallationCostChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="Up to ₦1,000,000">Up to ₦1,000,000</option>
                      <option value="₦1,000,000 - ₦5,000,000">₦1,000,000 - ₦5,000,000</option>
                      <option value="₦5,000,000 - ₦10,000,000">₦5,000,000 - ₦10,000,000</option>
                      <option value="₦10,000,000 - ₦20,000,000">₦10,000,000 - ₦20,000,000</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.installationCost ? 'block' : 'none' }}>
                      {formErrors.installationCost}
                    </p>
                    <p className="zf-instruction">
                      This is how much you spend to install a system for a client not how much you are being paid by the
                      client or customer.
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Monthly Sales */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    What is your average sales every month?
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.monthlySales ? 'border-red-500' : ''}`}
                      name="Dropdown4"
                      checktype="c1"
                      value={monthlySales}
                      onChange={handleMonthlySalesChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="₦1,000,000 - ₦5,000,000">₦1,000,000 - ₦5,000,000</option>
                      <option value="₦5,000,000 - ₦10,000,000">₦5,000,000 - ₦10,000,000</option>
                      <option value="₦10,000,000 - ₦20,000,000">₦10,000,000 - ₦20,000,000</option>
                      <option value="₦20,000,000 - ₦50,000,000">₦20,000,000 - ₦50,000,000</option>
                      <option value="Above ₦50,000,000">Above ₦50,000,000</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.monthlySales ? 'block' : 'none' }}>
                      {formErrors.monthlySales}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Can Provide Guarantor */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">
                    Can you provide a guarantor? (Your guarantor must be a salary earner)
                    <em className="zf-important">*</em>
                  </label>
                  <div className="zf-tempContDiv">
                    <select
                      className={`zf-form-sBox ${formErrors.guarantor ? 'border-red-500' : ''}`}
                      name="Dropdown2"
                      checktype="c1"
                      value={canProvideGuarantor}
                      onChange={handleCanProvideGuarantorChange}
                    >
                      <option value="-Select-">-Select-</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <p className="zf-errorMessage" style={{ display: formErrors.guarantor ? 'block' : 'none' }}>
                      {formErrors.guarantor}
                    </p>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Guarantor Name */}
                <li className="zf-tempFrmWrapper zf-name zf-namelarge">
                  <label className="zf-labelName">What is your Guarantor's Name?</label>
                  <div className="zf-tempContDiv zf-twoType">
                    <div className="zf-nameWrapper">
                      <span>
                        <input
                          type="text"
                          maxLength={255}
                          name="Name1_First"
                          fieldType={7}
                          placeholder=""
                          value={guarantorFirstName}
                          onChange={handleGuarantorFirstNameChange}
                        />
                        <label>First Name</label>
                      </span>
                      <span>
                        <input
                          type="text"
                          maxLength={255}
                          name="Name1_Last"
                          fieldType={7}
                          placeholder=""
                          value={guarantorLastName}
                          onChange={handleGuarantorLastNameChange}
                        />
                        <label>Last Name</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Guarantor Phone */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">What is your Guarantor's Phone Number?</label>
                  <div className="zf-tempContDiv zf-phonefld">
                    <div className="zf-phwrapper zf-phNumber">
                      <span>
                        <input
                          type="text"
                          compname="PhoneNumber1"
                          name="PhoneNumber1_countrycode"
                          maxLength={20}
                          checktype="c7"
                          value={guarantorPhone}
                          onChange={handleGuarantorPhoneChange}
                          phoneFormat="1"
                          isCountryCodeEnabled={false}
                          fieldType={11}
                          id="international_PhoneNumber1_countrycode"
                          valType="number"
                          phoneFormatType="1"
                          placeholder=""
                        />
                        <label>Number</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                  </div>
                  <div className="zf-clearBoth"></div>
                </li>

                {/* Guarantor Address */}
                <li className="zf-tempFrmWrapper zf-address zf-addrlarge">
                  <label className="zf-labelName">What is your Guarantor's Address?</label>
                  <div className="zf-tempContDiv zf-address">
                    <div className="zf-addrCont">
                      <span className="zf-addOne">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address1_AddressLine1"
                          checktype="c1"
                          placeholder=""
                          value={guarantorAddress}
                          onChange={handleGuarantorAddressChange}
                        />
                        <label>Street Address</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address1_City"
                          checktype="c1"
                          placeholder=""
                          value={guarantorCity}
                          onChange={handleGuarantorCityChange}
                        />
                        <label>City</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <input
                          type="text"
                          maxLength={255}
                          name="Address1_Region"
                          checktype="c1"
                          placeholder=""
                          value={guarantorRegion}
                          onChange={handleGuarantorRegionChange}
                        />
                        <label>State</label>
                      </span>
                      <span className="zf-flLeft zf-addtwo">
                        <select
                          className="zf-form-sBox"
                          name="Address1_Country"
                          checktype="c1"
                          value={guarantorCountry}
                          onChange={handleGuarantorCountryChange}
                        >
                          <option value="-Select-">-Select-</option>
                          {/* Including only Nigeria and a few other common options for brevity */}
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                        </select>
                        <label>Country</label>
                      </span>
                      <div className="zf-clearBoth"></div>
                    </div>
                  </div>
                  <div className="zf-eclearBoth"></div>
                </li>

                {/* Bank Statement Upload */}
                <li className="zf-tempFrmWrapper">
                  <label className="block text-[#101928] font-medium mb-2">
                    Upload your last 6 months account statement (Your business bank account)
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
                      <h3 className="font-medium">Upload Your Bank Statement</h3>
                      <p className="text-gray-500 text-sm">PDF format • Max. 5MB</p>
                      {fileName && <div className="mt-2 text-sm text-green-600 w-52 truncate">{fileName}</div>}
                    </div>

                    <input
                      type="file"
                      id="bankStatementUpload"
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

                {/* Any Questions */}
                <li className="zf-tempFrmWrapper zf-large">
                  <label className="zf-labelName">Do you have any question?</label>
                  <div className="zf-tempContDiv">
                    <span>
                      <input
                        type="text"
                        name="SingleLine2"
                        checktype="c1"
                        value={question}
                        onChange={handleQuestionChange}
                        maxLength={255}
                        fieldType={1}
                        placeholder=""
                      />
                    </span>
                  </div>
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

export default PartnerRegistrationForm;
