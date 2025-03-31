import React, { useEffect, useRef, useState } from 'react';
import './ZohoFormStyles.css';
import { useFetchInverterPackages } from '../../../../services/query/useCMS';

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

interface ZohoSolarFormProps {
  preSelectedPackage?: string;
  packageCost?: number;
  inverterPackage?: any;
}

// Add global type to Window for Zoho validation function
declare global {
  interface Window {
    zf_ValidateAndSubmit?: () => boolean;
    zf_MandArray?: string[];
    updateMandatoryFields?: () => void; // Changed to not require parameters
  }
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  package?: string;
  financingOption?: string;
  downPayment?: string;
  address?: string;
  fileUpload?: string;
  submitError?: string;
}

const ZohoSolarForm: React.FC<ZohoSolarFormProps> = ({ preSelectedPackage, packageCost, inverterPackage }) => {
  // Fetch inverter packages
  const { data: inverterPackages, isLoading } = useFetchInverterPackages();

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [showFinancingFields, setShowFinancingFields] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<string>(preSelectedPackage || '');
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(packageCost || 0);
  const [downPayment, setDownPayment] = useState<number>();
  const [downPaymentFormatted, setDownPaymentFormatted] = useState<string>(''); // For displaying formatted value
  const [repaymentMonths, setRepaymentMonths] = useState<string>('6');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('0');

  // Form input states
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [phoneDisplay, setPhoneDisplay] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [financingOption, setFinancingOption] = useState<string>('');

  useEffect(() => {
    // Initialize with preselected package if available
    if (preSelectedPackage) {
      setSelectedPackage(preSelectedPackage);

      // Also initialize package price correctly when pre-selected
      if (packageCost) {
        setSelectedPackagePrice(packageCost);
      } else if (inverterPackage && inverterPackage.cost) {
        setSelectedPackagePrice(inverterPackage.cost);
      }
    }

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
            'Dropdown2',
            'MultipleChoice',
            'Number',
            'Address_AddressLine1',
            'Address_City',
            'Address_Region',
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
  }, [preSelectedPackage, packageCost, inverterPackage]);

  // Calculate monthly payment based on repayment period and down payment
  useEffect(() => {
    if (selectedPackagePrice && downPayment !== undefined && repaymentMonths) {
      const months = parseInt(repaymentMonths) || 6;
      const remainingAmount = selectedPackagePrice - downPayment;

      const interestRate = 0.06; // 6% monthly interest

      const monthlyPaymentValue = remainingAmount / months;

      const interest = remainingAmount * interestRate;

      const monthlyPaymentValueWithInterest = Math.round(monthlyPaymentValue + interest);
      setMonthlyPayment(monthlyPaymentValueWithInterest.toLocaleString());
    }
  }, [selectedPackagePrice, downPayment, repaymentMonths]);

  // Format number with commas
  const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Form validation function - Bank statement validation removed
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    let missingRequiredFields = false;

    // Validate name
    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
      missingRequiredFields = true;
    }

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
      // Convert number to string for validation
      const phoneStr = phoneNumber.toString();
      if (phoneStr.length < 10 || phoneStr.length > 15) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate package selection
    if (!selectedPackage) {
      errors.package = 'Please select a package';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate financing option
    if (!financingOption) {
      errors.financingOption = 'Please select a financing option';
      isValid = false;
      missingRequiredFields = true;
    }

    // Validate down payment if financing is selected
    if (showFinancingFields && selectedPackagePrice > 0) {
      const minDownPayment = Math.round(selectedPackagePrice * 0.3);

      if (downPayment === undefined) {
        errors.downPayment = 'Down payment is required';
        isValid = false;
        missingRequiredFields = true;
      } else if (downPayment < minDownPayment) {
        errors.downPayment = `Down payment must be at least ₦${formatNumberWithCommas(minDownPayment)}`;
        isValid = false;
      } else if (downPayment > selectedPackagePrice) {
        errors.downPayment = `Down payment cannot exceed package price ₦${formatNumberWithCommas(
          selectedPackagePrice
        )}`;
        isValid = false;
      }
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

    // Bank statement validation completely removed

    setFormErrors(errors);

    // Set general error message if required fields are missing
    if (missingRequiredFields) {
      setGeneralError('Please fill in all required fields marked with *');
    } else {
      setGeneralError('');
    }

    return isValid;
  };

  // This function will be called on form submission
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
      // Use native form submit
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

  // Handle package selection change
  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPackageValue = e.target.value;
    setSelectedPackage(selectedPackageValue);

    // Clear package error if exists
    if (formErrors.package) {
      setFormErrors({ ...formErrors, package: undefined });
    }

    // Find the selected package and get its cost
    if (inverterPackages && selectedPackageValue !== '-Select-') {
      // Extract package title without the price part
      const packageTitle = selectedPackageValue.split(' - ')[0];

      const selectedPkg = inverterPackages.find((pkg: any) => pkg.title === packageTitle);

      if (selectedPkg) {
        setSelectedPackagePrice(selectedPkg.cost);
      } else {
        setSelectedPackagePrice(0);
      }
    } else {
      setSelectedPackagePrice(0);
    }
  };

  // Handle down payment change with formatting
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except digits
    const numericValue = e.target.value.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      // Allow empty input
      setDownPayment(undefined);
      setDownPaymentFormatted('');

      // Set error if field is required
      if (showFinancingFields) {
        setFormErrors({ ...formErrors, downPayment: 'Down payment is required' });
      }
      return;
    }

    // Convert to number
    const numValue = parseInt(numericValue, 10);

    // Format with commas
    setDownPaymentFormatted(formatNumberWithCommas(numValue));

    // Clear error
    if (formErrors.downPayment) {
      setFormErrors({ ...formErrors, downPayment: undefined });
    }

    // Validate the down payment is within acceptable range
    if (selectedPackagePrice > 0) {
      const minDownPayment = Math.round(selectedPackagePrice * 0.3);

      if (numValue < minDownPayment) {
        // If less than minimum, show validation message but still allow entry
        setFormErrors({
          ...formErrors,
          downPayment: `Down payment must be at least ₦${formatNumberWithCommas(minDownPayment)}`,
        });
      } else if (numValue > selectedPackagePrice) {
        // If more than package price, show validation message but still allow entry
        setFormErrors({
          ...formErrors,
          downPayment: `Down payment cannot exceed package price ₦${formatNumberWithCommas(selectedPackagePrice)}`,
        });
      }
    }

    // Store the actual numeric value in state
    setDownPayment(numValue);
  };

  // Updated to handle dropdown selection instead of text input
  const handleRepaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepaymentMonths(e.target.value);
  };

  // Handle financing option change
  const handleFinancingOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFinancingOption(value);

    // Clear financing option error if exists
    if (formErrors.financingOption) {
      setFormErrors({ ...formErrors, financingOption: undefined });
    }

    const isInstallment = value === 'Yes, I want to pay small small';
    setShowFinancingFields(isInstallment);

    // If switching to full payment, reset financing fields
    if (!isInstallment) {
      setDownPayment(undefined);
      setDownPaymentFormatted('');
      setRepaymentMonths('6'); // Default to 6 months
      setMonthlyPayment('0');

      // Clear any financing-related errors
      setFormErrors({
        ...formErrors,
        downPayment: undefined,
        fileUpload: undefined,
      });

      // Reset the file upload field when switching to full payment
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName('');
    }
  };

  // Handle file selection with validation for file type and size only
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

  // Name field handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);

    // Clear first name error if exists
    if (formErrors.firstName && value) {
      setFormErrors({ ...formErrors, firstName: undefined });
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);

    // Clear last name error if exists
    if (formErrors.lastName && value) {
      setFormErrors({ ...formErrors, lastName: undefined });
    }
  };

  // Phone handler - Modified to handle number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric characters
    const numericValue = e.target.value.replace(/\D/g, '');

    // Update the display value (preserves leading zeros)
    setPhoneDisplay(numericValue);

    if (numericValue === '') {
      setPhoneNumber(undefined);
    } else {
      // Convert to number and store for the API
      setPhoneNumber(parseInt(numericValue, 10));
    }

    // Clear phone error if exists
    if (formErrors.phone && numericValue) {
      setFormErrors({ ...formErrors, phone: undefined });
    }
  };

  // Email handler
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error if exists and valid
    if (formErrors.email && value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormErrors({ ...formErrors, email: undefined });
    }
  };

  // Address field handlers
  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStreetAddress(value);

    // Update address error state if needed
    updateAddressErrorState(value, city, region);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    // Update address error state if needed
    updateAddressErrorState(streetAddress, value, region);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegion(value);

    // Update address error state if needed
    updateAddressErrorState(streetAddress, city, value);
  };

  const updateAddressErrorState = (street: string, city: string, region: string) => {
    if (formErrors.address && street && city && region) {
      setFormErrors({ ...formErrors, address: undefined });
    }
  };

  return (
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
        action="https://forms.zohopublic.eu/segunsyna1/form/GetElectrifiedSignUpforSolarFinancing/formperma/DnWHighElh8enwyfFMKDUIMouSXrJk4as_OCr2rUHCs/htmlRecords/submit"
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
        {/* Add hidden field to pass selected package info separately */}
        <input type="hidden" name="SingleLine_package" value={selectedPackage ? selectedPackage : ''} />

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
                        value={phoneDisplay} // Use the display value here
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

              {/* Package Selection - Completely rebuilt */}
              <li className="zf-tempFrmWrapper zf-large">
                <label className="zf-labelName">
                  Which of the packages are you interested in?
                  <em className="zf-important">*</em>
                </label>
                <div className="zf-tempContDiv">
                  {isLoading ? (
                    <div className="text-gray-500">Loading packages...</div>
                  ) : (
                    <>
                      {/* This is a visible select element for user interaction */}
                      <select
                        className={`zf-form-sBox ${formErrors.package ? 'border-red-500' : ''}`}
                        value={selectedPackage}
                        onChange={handlePackageChange}
                      >
                        <option value="">-Select-</option>
                        {inverterPackages?.map((pkg: any) => {
                          const packageDisplayName = `${pkg.title} - ₦${pkg.cost.toLocaleString()}`;
                          const isSelected = inverterPackage && pkg.title === inverterPackage.title;

                          return (
                            <option key={pkg.id} value={packageDisplayName} selected={isSelected}>
                              {packageDisplayName}
                            </option>
                          );
                        })}
                      </select>

                      {/* Hidden input that will be submitted to Zoho with just the package title */}
                      <input
                        type="hidden"
                        name="Dropdown2"
                        value={selectedPackage ? selectedPackage.split(' - ')[0] : ''}
                      />
                    </>
                  )}
                  <p className="zf-errorMessage" style={{ display: formErrors.package ? 'block' : 'none' }}>
                    {formErrors.package}
                  </p>
                </div>
                {selectedPackagePrice > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    Selected package price: ₦{formatNumberWithCommas(selectedPackagePrice)}
                  </div>
                )}
                <div className="zf-clearBoth"></div>
              </li>

              {/* Financing Options */}
              <li className="zf-checkbox zf-tempFrmWrapper zf-oneColumns">
                <label className="zf-labelName">
                  Are you interested in our financing options?
                  <em className="zf-important">*</em>
                </label>
                <div className="zf-tempContDiv">
                  <div className="zf-overflow">
                    <span className="zf-multiAttType">
                      <input
                        className="accent-[#000] mr-2"
                        type="radio"
                        id="MultipleChoice_1"
                        name="MultipleChoice"
                        checktype="c1"
                        value="Yes, I want to pay small small"
                        onChange={handleFinancingOptionChange}
                        checked={financingOption === 'Yes, I want to pay small small'}
                      />
                      <label htmlFor="MultipleChoice_1" className="zf-checkChoice">
                        Yes, I want to pay small small
                      </label>
                    </span>
                    <span className="zf-multiAttType">
                      <input
                        className="accent-[#000] mr-2"
                        type="radio"
                        id="MultipleChoice_2"
                        name="MultipleChoice"
                        checktype="c1"
                        value="No, I can pay in full"
                        onChange={handleFinancingOptionChange}
                        checked={financingOption === 'No, I can pay in full'}
                      />
                      <label htmlFor="MultipleChoice_2" className="zf-checkChoice">
                        No, I can pay in full
                      </label>
                    </span>
                    <div className="zf-clearBoth"></div>
                  </div>
                  <p className="zf-errorMessage" style={{ display: formErrors.financingOption ? 'block' : 'none' }}>
                    {formErrors.financingOption}
                  </p>
                </div>
                <div className="zf-clearBoth"></div>
              </li>

              {/* Conditional Financing Fields */}
              {showFinancingFields && (
                <>
                  {/* Down Payment */}
                  <li className="zf-tempFrmWrapper zf-large">
                    <label className="zf-labelName">
                      How much downpayment are you going to make (minimum of 30% of your selected package is required)
                      <em className="zf-important">*</em>
                    </label>
                    <div className="zf-tempContDiv downPayment">
                      <span className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700">₦</span>
                        {/* Display input with formatted value */}
                        <input
                          type="text"
                          value={downPaymentFormatted}
                          placeholder=""
                          onChange={handleDownPaymentChange}
                          style={{ padding: '0.625rem 1.7rem' }}
                          className={formErrors.downPayment ? 'border-red-500' : ''}
                        />
                        {/* Hidden input to submit the actual number value to the API */}
                        <input type="hidden" name="Decimal" checktype="c3" value={downPayment || ''} />
                        <input type="hidden" name="Decimal_actual" value={downPayment || ''} />
                      </span>
                      <p className="zf-errorMessage" style={{ display: formErrors.downPayment ? 'block' : 'none' }}>
                        {formErrors.downPayment}
                      </p>
                      {selectedPackagePrice > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          Minimum downpayment: ₦{formatNumberWithCommas(Math.round(selectedPackagePrice * 0.3))} (30%)
                        </div>
                      )}
                    </div>
                    <div className="zf-clearBoth"></div>
                  </li>

                  {/* Repayment Period - Changed to Dropdown */}
                  <li className="zf-tempFrmWrapper zf-large">
                    <label className="zf-labelName">
                      How many months do you spread the balance (Max of 6 Months)
                      <em className="zf-important">*</em>
                    </label>
                    <div className="zf-tempContDiv">
                      <select
                        className="zf-form-sBox"
                        name="Number"
                        checktype="c2"
                        value={repaymentMonths}
                        onChange={handleRepaymentChange}
                      >
                        <option value="3">3 months</option>
                        <option value="4">4 months</option>
                        <option value="5">5 months</option>
                        <option value="6">6 months</option>
                      </select>
                      <p id="Number_error" className="zf-errorMessage" style={{ display: 'none' }}>
                        Invalid value
                      </p>
                      <p className="zf-instruction">We charge a fixed interest of 6% monthly</p>

                      {downPayment !== undefined && repaymentMonths && (
                        <div className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                          <p className="font-medium">
                            Your monthly payment: ₦{monthlyPayment}/month for {repaymentMonths} months
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="zf-clearBoth"></div>
                  </li>

                  {/* Occupation */}
                  <li className="zf-tempFrmWrapper zf-large">
                    <label className="zf-labelName">What do you do?</label>
                    <div className="zf-tempContDiv">
                      <select className="zf-form-sBox" name="Dropdown" checktype="c1">
                        <option value="-Select-">-Select-</option>
                        <option value="Employed">Employed</option>
                        <option value="Business Owner">Business Owner</option>
                        <option value="Both">Both</option>
                      </select>
                      <p id="Dropdown_error" className="zf-errorMessage" style={{ display: 'none' }}>
                        Invalid value
                      </p>
                    </div>
                    <div className="zf-clearBoth"></div>
                  </li>

                  {/* Bank Statement Upload - Optional now */}
                  <li className="zf-tempFrmWrapper">
                    <label className="block text-[#101928] font-medium mb-2">
                      Upload Bank Statement {/* Removed required asterisk */}
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
                        // removed required attribute
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
                </>
              )}

              {/* Installation Location */}
              <li className="zf-tempFrmWrapper zf-address zf-addrlarge">
                <label className="zf-labelName">
                  Enter your Installation Location
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
                    <span className="zf-addOne">
                      <input
                        type="text"
                        maxLength={255}
                        name="Address_AddressLine2"
                        checktype="c1"
                        placeholder=""
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                      />
                      <label>Address Line 2</label>
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
                      <label>State/Region/Province</label>
                    </span>
                    <div className="zf-clearBoth"></div>
                    <p className="zf-errorMessage" style={{ display: formErrors.address ? 'block' : 'none' }}>
                      {formErrors.address}
                    </p>
                  </div>
                </div>
                <div className="zf-eclearBoth"></div>
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
  );
};

export default ZohoSolarForm;
