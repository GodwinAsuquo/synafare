import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useFetchInverterPackages } from '../../../../services/query/useCMS';
import { useLocation } from 'react-router-dom';

// Define TypeScript interfaces
interface FormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  selectedPackage: string;
  financingOption: string;
  downPayment: string;
  repaymentPeriod: string;
  occupation: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  bankStatement: File | null;
}

interface LocationState {
  selectedPackage?: string;
  packageCost?: number;
  packageSlug?: string;
}

const InstallmentalPaymentForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showFinancingFields, setShowFinancingFields] = useState<boolean>(false);
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(0);
  const [minDownPayment, setMinDownPayment] = useState<number>(0);

  // Get navigation state with package information
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  // Fetch inverter packages
  const { data: inverterPackages, isLoading } = useFetchInverterPackages();

  // Set initial package and price when coming from AppliancesList
  useEffect(() => {
    if (locationState?.selectedPackage && inverterPackages) {
      // Find matching package in the list
      const matchingPackage = inverterPackages.find((pkg: any) => pkg.title === locationState.selectedPackage);

      if (matchingPackage) {
        const price = matchingPackage.cost || 0;
        setSelectedPackagePrice(price);
        const minDown = price * 0.3;
        setMinDownPayment(minDown);

        // We'll set these values in formik initialValues below
      } else if (locationState.packageCost) {
        // If we can't find it in the list but have cost info, use that
        setSelectedPackagePrice(locationState.packageCost);
        const minDown = locationState.packageCost * 0.3;
        setMinDownPayment(minDown);
      }
    }
  }, [locationState, inverterPackages]);

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone number is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    selectedPackage: Yup.string().required('Please select a package'),
    financingOption: Yup.string().required('Please select a financing option'),
    downPayment: Yup.string().when('financingOption', {
      is: 'installment',
      then: (schema) =>
        schema
          .required('Downpayment is required')
          .test('min-downpayment', 'Downpayment must be at least 30% of package price', function (value) {
            if (!value) return false;
            const numericValue = parseFloat(value.replace(/,/g, ''));
            return numericValue >= minDownPayment;
          }),
      otherwise: (schema) => schema,
    }),
    repaymentPeriod: Yup.string().when('financingOption', {
      is: 'installment',
      then: (schema) => schema.required('Repayment period is required'),
      otherwise: (schema) => schema,
    }),
    occupation: Yup.string().when('financingOption', {
      is: 'installment',
      then: (schema) => schema.required('Occupation is required'),
      otherwise: (schema) => schema,
    }),
    streetAddress: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State/Region is required'),
    bankStatement: Yup.mixed().when('financingOption', {
      is: 'installment',
      then: (schema) =>
        schema
          .required('Bank statement is required')
          .test('fileFormat', 'Only PDF files are supported', (value) => {
            if (!value) return true;
            return value && (value as File).type === 'application/pdf';
          })
          .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return true;
            return value && (value as File).size <= 5 * 1024 * 1024; // 5MB
          }),
      otherwise: (schema) => schema,
    }),
  });

  // Calculate monthly payment based on repayment period and down payment
  const calculateMonthlyPayment = (period: string, downPayment: string): string => {
    if (!period || !downPayment || !selectedPackagePrice) return '0';

    const months = parseInt(period) || 5;
    const downPaymentValue = parseFloat(downPayment.replace(/,/g, '')) || 0;
    const remainingAmount = selectedPackagePrice - downPaymentValue;

    // Calculate including 5-7% interest (using 6% as average)
    const interestRate = 0.06; // 6% monthly interest
    const totalWithInterest = remainingAmount * (1 + (interestRate * months) / 12);

    return Math.round(totalWithInterest / months).toLocaleString();
  };

  // Initialize formik with pre-selected package if available
  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      selectedPackage: locationState?.selectedPackage || '',
      financingOption: '',
      downPayment: locationState?.packageCost ? (locationState.packageCost * 0.3).toLocaleString() : '',
      repaymentPeriod: '5',
      occupation: '',
      streetAddress: '',
      addressLine2: '',
      city: '',
      state: '',
      bankStatement: null,
    },
    validationSchema,
    onSubmit: (values) => {
      // Log form values to console
      console.log('Form values:', {
        ...values,
        bankStatement: values.bankStatement
          ? {
              name: values.bankStatement.name,
              size: `${(values.bankStatement.size / 1024 / 1024).toFixed(2)}MB`,
              type: values.bankStatement.type,
            }
          : null,
      });
      // Add your form submission logic here
    },
  });

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      formik.setFieldValue('bankStatement', file);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle financing option change
  const handleFinancingOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const option = e.target.value;
    formik.setFieldValue('financingOption', option);
    setShowFinancingFields(option === 'installment');
  };

  // Handle package selection change
  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPackage = e.target.value;
    formik.setFieldValue('selectedPackage', selectedPackage);

    // Find the selected package and update price
    if (inverterPackages) {
      const package_ = inverterPackages.find((pkg: any) => pkg.title === selectedPackage);
      if (package_) {
        const price = package_.cost || 0;
        setSelectedPackagePrice(price);
        // Set minimum down payment (30% of package price)
        const minDown = price * 0.3;
        setMinDownPayment(minDown);
        formik.setFieldValue('downPayment', minDown.toLocaleString());
      }
    }
  };

  // Format number with commas
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle down payment change
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    formik.setFieldValue('downPayment', formattedValue);
  };

 

  return (
    <div className="max-w-2xl mx-auto p-6">
     

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name Fields (First and Last) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-[#101928] font-medium mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[#101928] font-medium mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-[#101928] font-medium mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
              formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[#101928] font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        {/* Package Selection */}
        <div>
          <label htmlFor="selectedPackage" className="block text-[#101928] font-medium mb-2">
            Which of the packages are you interested in? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="selectedPackage"
              name="selectedPackage"
              className={`w-full p-4 border rounded-lg appearance-none bg-white text-gray-700 ${
                formik.touched.selectedPackage && formik.errors.selectedPackage ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handlePackageChange}
              onBlur={formik.handleBlur}
              value={formik.values.selectedPackage}
              disabled={isLoading}
            >
              <option value="">Select a package</option>
              {!isLoading &&
                inverterPackages &&
                inverterPackages.map((pkg: any, index: number) => (
                  <option key={index} value={pkg.title}>
                    {pkg.title} - ₦{pkg.cost.toLocaleString()}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {formik.touched.selectedPackage && formik.errors.selectedPackage && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.selectedPackage}</div>
          )}
          {selectedPackagePrice > 0 && (
            <div className="mt-2 text-sm text-green-600">
              Selected package price: ₦{selectedPackagePrice.toLocaleString()}
            </div>
          )}
        </div>

        {/* Financing Options */}
        <div>
          <label className="block text-[#101928] font-medium mb-2">
            Are you interested in our financing options? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="installment"
                name="financingOption"
                type="radio"
                value="installment"
                className="h-5 w-5 text-white accent-[#000]"
                onChange={handleFinancingOptionChange}
                checked={formik.values.financingOption === 'installment'}
              />
              <label htmlFor="installment" className="ml-2 text-gray-700 ">
                Yes, I want to pay small small
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="fullPayment"
                name="financingOption"
                type="radio"
                value="fullPayment"
                className="h-5 w-5 text-white accent-[#000]"
                onChange={handleFinancingOptionChange}
                checked={formik.values.financingOption === 'fullPayment'}
              />
              <label htmlFor="fullPayment" className="ml-2 text-gray-700">
                No, I can pay in full
              </label>
            </div>
          </div>
          {formik.touched.financingOption && formik.errors.financingOption && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.financingOption}</div>
          )}
        </div>

        {/* Conditional Financing Fields */}
        {showFinancingFields && (
          <>
            {/* Down Payment */}
            <div>
              <label htmlFor="downPayment" className="block text-[#101928] font-medium mb-2">
                How much downpayment are you going to make? (minimum of 30% of your selected package is required)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700">₦</span>
                <input
                  id="downPayment"
                  name="downPayment"
                  type="text"
                  placeholder="Enter downpayment amount"
                  className={`w-full p-4 pl-10 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                    formik.touched.downPayment && formik.errors.downPayment ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleDownPaymentChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.downPayment}
                />
              </div>
              {formik.touched.downPayment && formik.errors.downPayment && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.downPayment}</div>
              )}
              {minDownPayment > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  Minimum downpayment: ₦{minDownPayment.toLocaleString()} (30%)
                </div>
              )}
            </div>

            {/* Repayment Period */}
            <div>
              <label htmlFor="repaymentPeriod" className="block text-[#101928] font-medium mb-2">
                How many months do you spread the balance? (Max of 6 Months) <span className="text-red-500">*</span>
              </label>
              <select
                id="repaymentPeriod"
                name="repaymentPeriod"
                className={`w-full p-4 border rounded-lg appearance-none bg-white text-gray-700 ${
                  formik.touched.repaymentPeriod && formik.errors.repaymentPeriod ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repaymentPeriod}
              >
                <option value="3">3 months</option>
                <option value="4">4 months</option>
                <option value="5">5 months</option>
                <option value="6">6 months</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                (P.S: We charge an interest rate of 5%-7% per month on the financed amount)
              </p>
              {formik.values.downPayment && formik.values.repaymentPeriod && (
                <div className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                  <p className="font-medium">
                    Your monthly payment: ₦
                    {calculateMonthlyPayment(formik.values.repaymentPeriod, formik.values.downPayment)}/month for{' '}
                    {formik.values.repaymentPeriod} months
                  </p>
                </div>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-[#101928] font-medium mb-2">
                What do you do? <span className="text-red-500">*</span>
              </label>
              <select
                id="occupation"
                name="occupation"
                className={`w-full p-4 border rounded-lg appearance-none bg-white text-gray-700 ${
                  formik.touched.occupation && formik.errors.occupation ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.occupation}
              >
                <option value="">Select your occupation</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.occupation && formik.errors.occupation && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.occupation}</div>
              )}
            </div>

            {/* Bank Statement Upload */}
            <div>
              <label className="block text-[#101928] font-medium mb-2">
                Upload Bank Statement <span className="text-red-500">*</span>
              </label>
              <div
                onClick={handleUploadClick}
                className={`flex items-center cursor-pointer border border-dashed rounded-lg px-4 py-8 ${
                  formik.touched.bankStatement && formik.errors.bankStatement
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="bg-[#F0F2F5] rounded-full p-3 mr-4">
                  <IoCloudUploadOutline size={24} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Upload Your Bank Statement</h3>
                  <p className="text-gray-500 text-sm">PDF format • Max. 5MB</p>
                  {fileName && <div className="mt-2 text-sm text-green-600 w-52 truncate">{fileName}</div>}
                </div>
                <input
                  ref={fileInputRef}
                  id="bankStatement"
                  name="bankStatement"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  onBlur={() => formik.setFieldTouched('bankStatement', true)}
                />
              </div>
              {formik.touched.bankStatement && formik.errors.bankStatement && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.bankStatement}</div>
              )}
            </div>
          </>
        )}

        {/* Installation Location */}
        <div>
          <h3 className="text-lg font-medium mb-4">Installation Location</h3>

          {/* Street Address */}
          <div className="mb-4">
            <label htmlFor="streetAddress" className="block text-[#101928] font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              id="streetAddress"
              name="streetAddress"
              type="text"
              placeholder="Enter your street address"
              className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                formik.touched.streetAddress && formik.errors.streetAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.streetAddress}
            />
            {formik.touched.streetAddress && formik.errors.streetAddress && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.streetAddress}</div>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="mb-4">
            <label htmlFor="addressLine2" className="block text-[#101928] font-medium mb-2">
              Address Line 2
            </label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-700 placeholder:font-light text-sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.addressLine2}
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-[#101928] font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                  formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-[#101928] font-medium mb-2">
                State/Region/Province <span className="text-red-500">*</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                placeholder="State/Region/Province"
                className={`w-full p-4 border rounded-lg text-gray-700 placeholder:font-light text-sm ${
                  formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
              />
              {formik.touched.state && formik.errors.state && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.state}</div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-4 bg-[#FEC601] hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default InstallmentalPaymentForm;
